'use client'

import { createContext, useContext } from 'react'

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

export interface LicenseRow {
  email: string
  tier: string
  expiresAt: string
  fingerprint: string
  orderId: string
}

export interface DeviceRow {
  fingerprint: string
  firstSeen: string
  lastSeen: string
  version: string
}

export interface PromoRow {
  code: string
  tier: string
  maxUses: number
  used: number
  createdAt: string
}

export interface AdminData {
  catalog: Catalog
  storeUrl: string
  feedUrl: string
  appInstallerUrl: string
  licenses: LicenseRow[]
  devices: DeviceRow[]
  promos: PromoRow[]
}

export interface DmaApi {
  data: AdminData
  notice: string
  error: string
  busy: boolean
  reload: () => Promise<void>
  run: (work: () => Promise<string | void>) => Promise<void>
  copy: (value: string) => Promise<void>
}

export const DmaContext = createContext<DmaApi | null>(null)

export function useDma(): DmaApi {
  const value = useContext(DmaContext)
  if (!value) throw new Error('DMA')
  return value
}

export function shortId(value: string): string {
  return value.length > 16 ? `${value.slice(0, 8)}…${value.slice(-6)}` : value
}

export function tierLabel(tier: string): string {
  if (tier === 'complete') return 'Completa'
  if (tier === 'basic') return 'Básica'
  return tier
}

export function when(value: string): string {
  return value ? value.slice(0, 16).replace('T', ' ') : '—'
}

export function daysLeft(expiresAt: string): number {
  return Math.ceil((Date.parse(expiresAt) - Date.now()) / 86_400_000)
}

export function storeUrlFor(version: string): string {
  return `https://optimizer.m2dominicanrd.com/v/${version}`
}
