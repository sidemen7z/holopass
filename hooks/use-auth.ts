"use client"

import { useState, useEffect, useCallback } from "react"
import { useAccount, useSignMessage, useEnsName, useEnsAvatar } from "wagmi"
import {
  type UserProfile,
  type AuthState,
  createSIWEMessage,
  generateNonce,
  saveUserProfile,
  loadUserProfile,
  clearUserProfile,
  createDefaultUserProfile,
} from "@/lib/auth"

export function useAuth() {
  const { address, isConnected, isDisconnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName })

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  })

  // Load user profile on mount and when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      const storedProfile = loadUserProfile()

      if (storedProfile && storedProfile.address.toLowerCase() === address.toLowerCase()) {
        // Update profile with latest ENS data
        const updatedProfile: UserProfile = {
          ...storedProfile,
          ensName: ensName || storedProfile.ensName,
          avatar: ensAvatar || storedProfile.avatar,
          lastActive: Date.now(),
        }

        setAuthState({
          isAuthenticated: true,
          user: updatedProfile,
          isLoading: false,
        })

        saveUserProfile(updatedProfile)
      } else {
        // New user or different wallet
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        })
      }
    } else if (isDisconnected) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      })
    }
  }, [address, isConnected, isDisconnected, ensName, ensAvatar])

  const signIn = useCallback(async (): Promise<boolean> => {
    if (!address || !isConnected) {
      throw new Error("Wallet not connected")
    }

    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }))

      const nonce = generateNonce()
      const message = createSIWEMessage(address, nonce)

      // Sign the message
      const signature = await signMessageAsync({ message })

      // Create or update user profile
      const existingProfile = loadUserProfile()
      const userProfile: UserProfile =
        existingProfile?.address.toLowerCase() === address.toLowerCase()
          ? {
              ...existingProfile,
              ensName: ensName || existingProfile.ensName,
              avatar: ensAvatar || existingProfile.avatar,
              lastActive: Date.now(),
            }
          : {
              ...createDefaultUserProfile(address),
              ensName: ensName || undefined,
              avatar: ensAvatar || undefined,
            }

      // Save profile and auth state
      saveUserProfile(userProfile)

      setAuthState({
        isAuthenticated: true,
        user: userProfile,
        isLoading: false,
      })

      return true
    } catch (error) {
      console.error("Sign-in failed:", error)
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      return false
    }
  }, [address, isConnected, signMessageAsync, ensName, ensAvatar])

  const signOut = useCallback(() => {
    clearUserProfile()
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    })
  }, [])

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setAuthState((prev) => {
      if (!prev.user) return prev

      const updatedUser = { ...prev.user, ...updates, lastActive: Date.now() }
      saveUserProfile(updatedUser)

      return {
        ...prev,
        user: updatedUser,
      }
    })
  }, [])

  const addXP = useCallback((amount: number) => {
    setAuthState((prev) => {
      if (!prev.user) return prev

      const newXP = prev.user.xp + amount
      const newLevel = Math.floor(newXP / 500) + 1 // 500 XP per level

      const updatedUser = {
        ...prev.user,
        xp: newXP,
        level: Math.max(prev.user.level, newLevel),
        lastActive: Date.now(),
      }

      saveUserProfile(updatedUser)

      return {
        ...prev,
        user: updatedUser,
      }
    })
  }, [])

  const addStamp = useCallback(() => {
    setAuthState((prev) => {
      if (!prev.user) return prev

      const updatedUser = {
        ...prev.user,
        stampsCount: prev.user.stampsCount + 1,
        lastActive: Date.now(),
      }

      saveUserProfile(updatedUser)

      return {
        ...prev,
        user: updatedUser,
      }
    })
  }, [])

  return {
    ...authState,
    signIn,
    signOut,
    updateUserProfile,
    addXP,
    addStamp,
    isConnected,
    address,
  }
}
