import 'server-only'

import { getApps, initializeApp } from 'firebase/app'
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, limit, query, setDoc, where } from 'firebase/firestore'
import { firebaseConfig } from '@/lib/firebase-public'
import { signLicense, verifyLicense, type PaidTier } from '@/server/paypal'

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

export async function readLicense(fingerprint: string): Promise<{ tier: 'free' | PaidTier; expiresAt: string | null }> {
  const admin = await adminDb()
  const data = admin
    ? ((await admin.collection('m2_licenses').doc(fingerprint).get()).data() as LicenseRecord | undefined)
    : ((await getDoc(doc(webDb(), 'm2_licenses', fingerprint))).data() as LicenseRecord | undefined)
  if (!data) return { tier: 'free', expiresAt: null }
  const valid = verifyLicense(data.fingerprint, data.tier, data.expiresAt, data.orderId, data.signature)
  if (!valid || data.fingerprint !== fingerprint) return { tier: 'free', expiresAt: null }
  if (Date.parse(data.expiresAt) <= Date.now()) return { tier: 'free', expiresAt: data.expiresAt }
  return { tier: data.tier, expiresAt: data.expiresAt }
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

export async function listLicenses(): Promise<LicenseRecord[]> {
  const rows = await licenseRows()
  return rows.flatMap((row) => {
    const record = asLicense(row.id, row.data, false)
    return record ? [record] : []
  })
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

export async function publishRelease(version: string, url: string): Promise<Catalog> {
  const current = await readCatalog()
  const publishedAt = new Date().toISOString()
  const versions = current.versions.filter((item) => item.version !== version && item.version !== current.version)
  if (current.version && current.url && current.version !== version) {
    versions.push({ version: current.version, url: current.url, publishedAt })
  }
  versions.push({ version, url, publishedAt })
  const payload = { version, urlupdate: url, versions }
  const admin = await adminDb()
  if (admin) {
    await admin.collection('m2optimizer').doc(RELEASE_DOC).set(payload, { merge: true })
  } else {
    await setDoc(doc(webDb(), 'm2optimizer', RELEASE_DOC), payload, { merge: true })
  }
  return { version, url, versions }
}
