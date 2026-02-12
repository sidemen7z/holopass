import type { Address } from "viem"

export interface UserProfile {
  address: Address
  ensName?: string
  avatar?: string
  level: number
  xp: number
  stampsCount: number
  joinedAt: number
  lastActive: number
  preferences: {
    notifications: boolean
    publicProfile: boolean
    shareAchievements: boolean
  }
}

export interface AuthState {
  isAuthenticated: boolean
  user: UserProfile | null
  isLoading: boolean
}

// Sign-in with Ethereum (SIWE) message template
export function createSIWEMessage(address: Address, nonce: string): string {
  const domain = typeof window !== "undefined" ? window.location.host : "holopass.app"
  const uri = typeof window !== "undefined" ? window.location.origin : "https://holopass.app"
  const issuedAt = new Date().toISOString()

  return `${domain} wants you to sign in with your Ethereum account:
${address}

Welcome to HoloPass! Sign this message to authenticate your digital identity.

URI: ${uri}
Version: 1
Chain ID: 1
Nonce: ${nonce}
Issued At: ${issuedAt}`
}

export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Local storage keys
export const AUTH_STORAGE_KEYS = {
  USER_PROFILE: "holopass_user_profile",
  AUTH_TOKEN: "holopass_auth_token",
  LAST_SIGNATURE: "holopass_last_signature",
} as const

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile))
  }
}

export function loadUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEYS.USER_PROFILE)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function clearUserProfile(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER_PROFILE)
    localStorage.removeItem(AUTH_STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(AUTH_STORAGE_KEYS.LAST_SIGNATURE)
  }
}

export function createDefaultUserProfile(address: Address): UserProfile {
  return {
    address,
    level: 1,
    xp: 0,
    stampsCount: 0,
    joinedAt: Date.now(),
    lastActive: Date.now(),
    preferences: {
      notifications: true,
      publicProfile: true,
      shareAchievements: true,
    },
  }
}
