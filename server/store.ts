import 'server-only'

import { getApps, initializeApp } from 'firebase/app'
import { randomBytes } from 'node:crypto'
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, limit, query, runTransaction, setDoc, where } from 'firebase/firestore'
import { firebaseConfig } from '@/lib/firebase-public'
import {
  isLaunchFreeActive,
  LAUNCH_FREE_EMAIL,
  LAUNCH_FREE_ORDER_ID,
  LAUNCH_FREE_UNTIL,
} from '@/server/campaign'
import { signLicense, signPromo, verifyLicense, type PaidTier } from '@/server/paypal'

export interface LicenseRecord {
  email: string
  tier: PaidTier
  expiresAt: string
  fingerprint: string
  orderId: string
  signature: string
}

export interface ReleaseRecord {
  version: string
  url: string
  notes: string
  publishedAt: string
}

function webDb() {
  const app = getApps()[0] ?? initializeApp(firebaseConfig)
  return getFirestore(app)
}

async function adminDb() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (!raw) return null
  const { cert, getApps, initializeApp } = await import('firebase-admin/app')
  const { getFirestore } = await import('firebase-admin/firestore')
  if (!getApps().length) initializeApp({ credential: cert(JSON.parse(raw) as Record<string, string>) })
  return getFirestore()
}

export async function saveLicense(record: LicenseRecord): Promise<void> {
  const admin = await adminDb()
  if (admin) {
    await admin.collection('m2_licenses').doc(record.fingerprint).set(record)
    return
  }
  await setDoc(doc(webDb(), 'm2_licenses', record.fingerprint), record)
}

async function loadLicenseRecord(fingerprint: string): Promise<LicenseRecord | undefined> {
  const admin = await adminDb()
  if (admin) {
    return (await admin.collection('m2_licenses').doc(fingerprint).get()).data() as LicenseRecord | undefined
  }
  return (await getDoc(doc(webDb(), 'm2_licenses', fingerprint))).data() as LicenseRecord | undefined
}

function activePaidFrom(
  data: LicenseRecord | undefined,
  fingerprint: string,
): { tier: PaidTier; expiresAt: string; orderId: string } | null {
  if (!data) return null
  const valid = verifyLicense(data.fingerprint, data.tier, data.expiresAt, data.orderId, data.signature)
  if (!valid || data.fingerprint !== fingerprint) return null
  if (data.tier !== 'basic' && data.tier !== 'complete') return null
  if (Date.parse(data.expiresAt) <= Date.now()) return null
  return { tier: data.tier, expiresAt: data.expiresAt, orderId: data.orderId }
}

/** Grants Complete until LAUNCH_FREE_UNTIL when the campaign is active. Never shortens a better paid license. */
export async function ensureLaunchFreeLicense(fingerprint: string): Promise<{ tier: 'free' | PaidTier; expiresAt: string | null }> {
  if (!isLaunchFreeActive()) {
    return readLicenseRaw(fingerprint)
  }
  const existing = await loadLicenseRecord(fingerprint)
  const active = activePaidFrom(existing, fingerprint)
  const campaignEnd = Date.parse(LAUNCH_FREE_UNTIL)
  if (active?.tier === 'complete' && Date.parse(active.expiresAt) >= campaignEnd) {
    return { tier: 'complete', expiresAt: active.expiresAt }
  }
  const expiresAt =
    active && Date.parse(active.expiresAt) > campaignEnd ? active.expiresAt : LAUNCH_FREE_UNTIL
  if (active?.tier === 'complete' && active.expiresAt === expiresAt) {
    return { tier: 'complete', expiresAt }
  }
  const orderId =
    active && Date.parse(active.expiresAt) > campaignEnd && active.orderId !== LAUNCH_FREE_ORDER_ID
      ? active.orderId
      : LAUNCH_FREE_ORDER_ID
  const record: LicenseRecord = {
    email: existing?.email && existing.email.length > 0 ? existing.email : LAUNCH_FREE_EMAIL,
    tier: 'complete',
    expiresAt,
    fingerprint,
    orderId,
    signature: signLicense(fingerprint, 'complete', expiresAt, orderId),
  }
  await saveLicense(record)
  return { tier: 'complete', expiresAt }
}

async function readLicenseRaw(fingerprint: string): Promise<{ tier: 'free' | PaidTier; expiresAt: string | null }> {
  const data = await loadLicenseRecord(fingerprint)
  if (!data) return { tier: 'free', expiresAt: null }
  const valid = verifyLicense(data.fingerprint, data.tier, data.expiresAt, data.orderId, data.signature)
  if (!valid || data.fingerprint !== fingerprint) return { tier: 'free', expiresAt: null }
  if (Date.parse(data.expiresAt) <= Date.now()) return { tier: 'free', expiresAt: data.expiresAt }
  return { tier: data.tier, expiresAt: data.expiresAt }
}

export async function readLicense(fingerprint: string): Promise<{ tier: 'free' | PaidTier; expiresAt: string | null }> {
  return ensureLaunchFreeLicense(fingerprint)
}

export async function touchDevice(fingerprint: string, version: string): Promise<void> {
  const now = new Date().toISOString()
  const admin = await adminDb()
  if (admin) {
    const ref = admin.collection('m2_devices').doc(fingerprint)
    const current = await ref.get()
    const firstSeen = (current.data()?.firstSeen as string | undefined) ?? now
    await ref.set({ fingerprint, firstSeen, lastSeen: now, version })
    return
  }
  const ref = doc(webDb(), 'm2_devices', fingerprint)
  const current = await getDoc(ref)
  const firstSeen = (current.data()?.firstSeen as string | undefined) ?? now
  await setDoc(ref, { fingerprint, firstSeen, lastSeen: now, version })
}

const RELEASE_DOC = 'wlRcYzT17u74kyFtKlGy'
const DMA_DOC = '8tsjnErktPZKN5p7kgI4'
export const SITE_ORIGIN = 'https://optimizer.m2dominicanrd.com'
export const APP_INSTALLER_URL = `${SITE_ORIGIN}/M2Optimizer.appinstaller`

export interface VersionEntry {
  version: string
  url: string
  publishedAt: string
}

export interface Catalog {
  version: string
  url: string
  versions: VersionEntry[]
}

export interface DeviceRecord {
  fingerprint: string
  firstSeen: string
  lastSeen: string
  version: string
}

const VERSION = /^\d+\.\d+\.\d+$/
const VERSION_KEEP = 5

export function versionedPath(version: string): string {
  return VERSION.test(version) ? `/v/${version}` : '/download'
}

export function versionedUrl(version: string): string {
  return `${SITE_ORIGIN}/v/${encodeURIComponent(version)}`
}

function emailKeys(email: string): string[] {
  const trimmed = email.trim()
  const lower = trimmed.toLowerCase()
  return trimmed === lower ? [lower] : [trimmed, lower]
}

function asLicense(id: string, data: Record<string, unknown> | undefined, activeOnly = true): LicenseRecord | null {
  if (!data || data.fingerprint !== id) return null
  if (data.tier !== 'basic' && data.tier !== 'complete') return null
  if (typeof data.email !== 'string' || typeof data.expiresAt !== 'string' || typeof data.orderId !== 'string' || typeof data.signature !== 'string') return null
  const record: LicenseRecord = {
    email: data.email,
    tier: data.tier,
    expiresAt: data.expiresAt,
    fingerprint: id,
    orderId: data.orderId,
    signature: data.signature,
  }
  if (!verifyLicense(record.fingerprint, record.tier, record.expiresAt, record.orderId, record.signature)) return null
  if (activeOnly && Date.parse(record.expiresAt) <= Date.now()) return null
  return record
}

function prefer(current: LicenseRecord | null, next: LicenseRecord): LicenseRecord {
  if (!current) return next
  if (current.tier !== next.tier) return next.tier === 'complete' ? next : current
  return Date.parse(next.expiresAt) > Date.parse(current.expiresAt) ? next : current
}

function covers(active: PaidTier, requested: PaidTier): boolean {
  return active === 'complete' || active === requested
}

function asVersions(value: unknown): VersionEntry[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return []
    const row = item as Record<string, unknown>
    if (typeof row.version !== 'string' || typeof row.url !== 'string') return []
    return [{ version: row.version, url: row.url, publishedAt: typeof row.publishedAt === 'string' ? row.publishedAt : '' }]
  })
}

async function licenseRows(): Promise<{ id: string; data: Record<string, unknown> }[]> {
  const admin = await adminDb()
  if (admin) {
    const snap = await admin.collection('m2_licenses').limit(80).get()
    return snap.docs.map((item) => ({ id: item.id, data: (item.data() ?? {}) as Record<string, unknown> }))
  }
  const snap = await getDocs(query(collection(webDb(), 'm2_licenses'), limit(80)))
  return snap.docs.map((item) => ({ id: item.id, data: (item.data() ?? {}) as Record<string, unknown> }))
}

export async function findActiveLicense(email: string): Promise<LicenseRecord | null> {
  const keys = emailKeys(email)
  const admin = await adminDb()
  const rows = admin
    ? (await admin.collection('m2_licenses').where('email', 'in', keys).get()).docs.map((item) => ({
        id: item.id,
        data: (item.data() ?? {}) as Record<string, unknown>,
      }))
    : (await getDocs(query(collection(webDb(), 'm2_licenses'), where('email', 'in', keys)))).docs.map((item) => ({
        id: item.id,
        data: (item.data() ?? {}) as Record<string, unknown>,
      }))
  return rows.reduce<LicenseRecord | null>((best, row) => {
    const record = asLicense(row.id, row.data)
    return record ? prefer(best, record) : best
  }, null)
}

async function removeLicense(fingerprint: string): Promise<void> {
  const admin = await adminDb()
  if (admin) {
    await admin.collection('m2_licenses').doc(fingerprint).delete()
    return
  }
  await deleteDoc(doc(webDb(), 'm2_licenses', fingerprint))
}

export async function claimLicense(email: string, fingerprint: string, requested?: PaidTier): Promise<LicenseRecord | null> {
  const active = await findActiveLicense(email)
  if (!active) return null
  if (requested && !covers(active.tier, requested)) return null
  if (active.fingerprint === fingerprint) return active
  const moved: LicenseRecord = {
    ...active,
    fingerprint,
    signature: signLicense(fingerprint, active.tier, active.expiresAt, active.orderId),
  }
  await saveLicense(moved)
  if (active.fingerprint !== fingerprint) {
    try {
      await removeLicense(active.fingerprint)
    } catch {
      /* El equipo nuevo ya tiene la licencia firmada. */
    }
  }
  return moved
}

export async function listLicenses(includeExpired = false): Promise<LicenseRecord[]> {
  const rows = await licenseRows()
  return rows.flatMap((row) => {
    const record = asLicense(row.id, row.data, !includeExpired)
    return record ? [record] : []
  })
}

export async function extendLicense(fingerprint: string): Promise<LicenseRecord> {
  const current = asLicense(fingerprint, (await loadLicenseRecord(fingerprint)) as Record<string, unknown> | undefined, false)
  if (!current) throw new Error('Licencia no encontrada')
  const base = Math.max(Date.now(), Date.parse(current.expiresAt) || 0)
  const expires = new Date(base)
  expires.setUTCFullYear(expires.getUTCFullYear() + 1)
  const expiresAt = expires.toISOString()
  const next: LicenseRecord = {
    ...current,
    expiresAt,
    signature: signLicense(fingerprint, current.tier, expiresAt, current.orderId),
  }
  await saveLicense(next)
  return next
}

export async function revokeLicense(fingerprint: string): Promise<void> {
  const current = await loadLicenseRecord(fingerprint)
  if (!current) throw new Error('Licencia no encontrada')
  await removeLicense(fingerprint)
}

export async function listDevices(): Promise<DeviceRecord[]> {
  const admin = await adminDb()
  const rows = admin
    ? (await admin.collection('m2_devices').limit(80).get()).docs.map((item) => item.data() as Record<string, unknown>)
    : (await getDocs(query(collection(webDb(), 'm2_devices'), limit(80)))).docs.map((item) => item.data() as Record<string, unknown>)
  return rows.flatMap((row) => {
    if (typeof row.fingerprint !== 'string') return []
    return [{
      fingerprint: row.fingerprint,
      firstSeen: typeof row.firstSeen === 'string' ? row.firstSeen : '',
      lastSeen: typeof row.lastSeen === 'string' ? row.lastSeen : '',
      version: typeof row.version === 'string' ? row.version : '',
    }]
  })
}

export async function readDmaPin(): Promise<string | null> {
  const admin = await adminDb()
  const data = admin
    ? ((await admin.collection('DMA').doc(DMA_DOC).get()).data() as Record<string, unknown> | undefined)
    : ((await getDoc(doc(webDb(), 'DMA', DMA_DOC))).data() as Record<string, unknown> | undefined)
  const pin = data?.['dma pin']
  return typeof pin === 'string' ? pin : null
}

async function releaseData(): Promise<Record<string, unknown> | undefined> {
  const admin = await adminDb()
  if (admin) return (await admin.collection('m2optimizer').doc(RELEASE_DOC).get()).data() as Record<string, unknown> | undefined
  return (await getDoc(doc(webDb(), 'm2optimizer', RELEASE_DOC))).data() as Record<string, unknown> | undefined
}

export async function readCatalog(): Promise<Catalog> {
  const data = await releaseData()
  const version = typeof data?.version === 'string' ? data.version : ''
  const url = typeof data?.urlupdate === 'string' ? data.urlupdate : ''
  return { version, url, versions: asVersions(data?.versions) }
}

export async function readRelease(): Promise<ReleaseRecord> {
  const catalog = await readCatalog()
  if (!catalog.version) return { version: '', url: '', notes: '', publishedAt: '' }
  return { version: catalog.version, url: catalog.url, notes: '', publishedAt: '' }
}

export async function fileUrlFor(version: string): Promise<string | null> {
  const catalog = await readCatalog()
  const saved = catalog.versions.find((item) => item.version === version)
  if (saved?.url) return saved.url
  if (catalog.version === version && catalog.url) return catalog.url
  return null
}

export function keepLatestVersions(versions: VersionEntry[], pinned?: string): VersionEntry[] {
  const ranked = versions
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      const byTime = (right.item.publishedAt || '').localeCompare(left.item.publishedAt || '')
      return byTime !== 0 ? byTime : right.index - left.index
    })
    .slice(0, VERSION_KEEP)
    .map((entry) => entry.item)
  if (!pinned || ranked.some((item) => item.version === pinned)) return ranked
  const live = versions.find((item) => item.version === pinned)
  if (!live) return ranked
  return [live, ...ranked.filter((item) => item.version !== pinned)].slice(0, VERSION_KEEP)
}

async function writeCatalog(catalog: Catalog): Promise<void> {
  const payload = { version: catalog.version, urlupdate: catalog.url, versions: catalog.versions }
  const admin = await adminDb()
  if (admin) {
    await admin.collection('m2optimizer').doc(RELEASE_DOC).set(payload, { merge: true })
    return
  }
  await setDoc(doc(webDb(), 'm2optimizer', RELEASE_DOC), payload, { merge: true })
}

export async function trimCatalog(catalog: Catalog): Promise<Catalog> {
  const versions = keepLatestVersions(catalog.versions, catalog.version)
  if (versions.length === catalog.versions.length) return catalog
  const next = { version: catalog.version, url: catalog.url, versions }
  await writeCatalog(next)
  return next
}

export async function publishRelease(version: string, url: string): Promise<Catalog> {
  const current = await readCatalog()
  const publishedAt = new Date().toISOString()
  const versions = current.versions.filter((item) => item.version !== version && item.version !== current.version)
  if (current.version && current.url && current.version !== version) {
    versions.push({ version: current.version, url: current.url, publishedAt })
  }
  versions.push({ version, url, publishedAt })
  const next = { version, url, versions: keepLatestVersions(versions, version) }
  await writeCatalog(next)
  return next
}

const PROMO_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export type PromoReason = 'missing' | 'used' | 'empty' | 'invalid' | 'covered'

export class PromoError extends Error {
  constructor(readonly reason: PromoReason) {
    super(reason)
  }
}

export interface PromoRecord {
  code: string
  tier: PaidTier
  maxUses: number
  used: number
  createdAt: string
}

function mintCode(): string {
  const chars = [...randomBytes(10)].map((byte) => PROMO_ALPHABET[byte % PROMO_ALPHABET.length])
  return `${chars.slice(0, 2).join('')}-${chars.slice(2, 6).join('')}-${chars.slice(6).join('')}`
}

function asPromo(id: string, data: Record<string, unknown> | undefined): (PromoRecord & { signature: string }) | null {
  if (!data || data.code !== id) return null
  if (data.tier !== 'basic' && data.tier !== 'complete') return null
  if (typeof data.createdAt !== 'string' || typeof data.signature !== 'string') return null
  const maxUses = Number(data.maxUses)
  const used = Number(data.used)
  if (!Number.isInteger(maxUses) || maxUses < 1 || !Number.isInteger(used) || used < 0) return null
  const record = { code: id, tier: data.tier as PaidTier, maxUses, used, createdAt: data.createdAt, signature: data.signature }
  if (signPromo(record.code, record.tier, record.maxUses, record.used, record.createdAt) !== record.signature) return null
  return record
}

function yearFromNow(): string {
  const expires = new Date()
  expires.setUTCFullYear(expires.getUTCFullYear() + 1)
  return expires.toISOString()
}

export async function createPromo(tier: PaidTier, maxUses: number): Promise<PromoRecord> {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const code = mintCode()
    const createdAt = new Date().toISOString()
    const signature = signPromo(code, tier, maxUses, 0, createdAt)
    const record = { code, tier, maxUses, used: 0, createdAt, signature }
    const admin = await adminDb()
    if (admin) {
      const ref = admin.collection('m2_promos').doc(code)
      if ((await ref.get()).exists) continue
      await ref.set(record)
      return { code, tier, maxUses, used: 0, createdAt }
    }
    const ref = doc(webDb(), 'm2_promos', code)
    if ((await getDoc(ref)).exists()) continue
    await setDoc(ref, record)
    return { code, tier, maxUses, used: 0, createdAt }
  }
  throw new Error('No se pudo generar un código')
}

export async function closePromo(code: string): Promise<'deleted' | 'closed'> {
  const admin = await adminDb()
  const snap = admin
    ? await admin.collection('m2_promos').doc(code).get()
    : await getDoc(doc(webDb(), 'm2_promos', code))
  const promo = asPromo(code, snap.data() as Record<string, unknown> | undefined)
  if (!promo) throw new Error('Código no encontrado')
  if (promo.used >= promo.maxUses) return 'closed'
  if (promo.used === 0) {
    if (admin) await admin.collection('m2_promos').doc(code).delete()
    else await deleteDoc(doc(webDb(), 'm2_promos', code))
    return 'deleted'
  }
  const next = {
    ...promo,
    maxUses: promo.used,
    signature: signPromo(code, promo.tier, promo.used, promo.used, promo.createdAt),
  }
  if (admin) await admin.collection('m2_promos').doc(code).set(next)
  else await setDoc(doc(webDb(), 'm2_promos', code), next)
  return 'closed'
}

export async function listPromos(): Promise<PromoRecord[]> {
  const admin = await adminDb()
  const rows = admin
    ? (await admin.collection('m2_promos').limit(40).get()).docs.map((item) => ({ id: item.id, data: item.data() as Record<string, unknown> }))
    : (await getDocs(query(collection(webDb(), 'm2_promos'), limit(40)))).docs.map((item) => ({ id: item.id, data: item.data() as Record<string, unknown> }))
  return rows.flatMap((row) => {
    const promo = asPromo(row.id, row.data)
    return promo ? [{ code: promo.code, tier: promo.tier, maxUses: promo.maxUses, used: promo.used, createdAt: promo.createdAt }] : []
  })
}

export async function redeemPromo(code: string, fingerprint: string, email: string): Promise<{ tier: PaidTier; expiresAt: string }> {
  const admin = await adminDb()
  if (admin) return redeemPromoAdmin(admin, code, fingerprint, email)
  return redeemPromoWeb(code, fingerprint, email)
}

async function redeemPromoAdmin(
  admin: NonNullable<Awaited<ReturnType<typeof adminDb>>>,
  code: string,
  fingerprint: string,
  email: string,
): Promise<{ tier: PaidTier; expiresAt: string }> {
  return admin.runTransaction(async (tx) => {
    const ref = admin.collection('m2_promos').doc(code)
    const useRef = ref.collection('uses').doc(fingerprint)
    const licenseRef = admin.collection('m2_licenses').doc(fingerprint)
    const promoSnap = await tx.get(ref)
    const useSnap = await tx.get(useRef)
    const licenseSnap = await tx.get(licenseRef)
    const promo = asPromo(code, promoSnap.data() as Record<string, unknown> | undefined)
    if (!promo) throw new PromoError('missing')
    if (useSnap.exists) throw new PromoError('used')
    if (promo.used >= promo.maxUses) throw new PromoError('empty')
    const current = asLicense(fingerprint, licenseSnap.data() as Record<string, unknown> | undefined)
    if (current && covers(current.tier, promo.tier)) throw new PromoError('covered')
    const used = promo.used + 1
    const expiresAt = yearFromNow()
    const orderId = `promo:${code}`
    tx.set(ref, { ...promo, used, signature: signPromo(code, promo.tier, promo.maxUses, used, promo.createdAt) })
    tx.set(useRef, { fingerprint, email, at: new Date().toISOString() })
    tx.set(licenseRef, {
      email,
      tier: promo.tier,
      expiresAt,
      fingerprint,
      orderId,
      signature: signLicense(fingerprint, promo.tier, expiresAt, orderId),
    })
    return { tier: promo.tier, expiresAt }
  })
}

async function redeemPromoWeb(code: string, fingerprint: string, email: string): Promise<{ tier: PaidTier; expiresAt: string }> {
  const db = webDb()
  return runTransaction(db, async (tx) => {
    const ref = doc(db, 'm2_promos', code)
    const useRef = doc(db, 'm2_promos', code, 'uses', fingerprint)
    const licenseRef = doc(db, 'm2_licenses', fingerprint)
    const promoSnap = await tx.get(ref)
    const useSnap = await tx.get(useRef)
    const licenseSnap = await tx.get(licenseRef)
    const promo = asPromo(code, promoSnap.data() as Record<string, unknown> | undefined)
    if (!promo) throw new PromoError('missing')
    if (useSnap.exists()) throw new PromoError('used')
    if (promo.used >= promo.maxUses) throw new PromoError('empty')
    const current = asLicense(fingerprint, licenseSnap.data() as Record<string, unknown> | undefined)
    if (current && covers(current.tier, promo.tier)) throw new PromoError('covered')
    const used = promo.used + 1
    const expiresAt = yearFromNow()
    const orderId = `promo:${code}`
    tx.set(ref, { ...promo, used, signature: signPromo(code, promo.tier, promo.maxUses, used, promo.createdAt) })
    tx.set(useRef, { fingerprint, email, at: new Date().toISOString() })
    tx.set(licenseRef, {
      email,
      tier: promo.tier,
      expiresAt,
      fingerprint,
      orderId,
      signature: signLicense(fingerprint, promo.tier, expiresAt, orderId),
    })
    return { tier: promo.tier, expiresAt }
  })
}
