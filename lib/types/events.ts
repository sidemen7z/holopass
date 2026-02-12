import type { Address } from "viem"

export interface Event {
  id: string
  title: string
  description: string
  location: {
    name: string
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  startDate: string
  endDate: string
  image: string
  category: "conference" | "meetup" | "workshop" | "art" | "networking" | "other"
  capacity: number
  attendeeCount: number
  price: {
    amount: number
    currency: "ETH" | "MATIC" | "USD"
    free: boolean
  }
  organizer: {
    address: Address
    name: string
    avatar?: string
  }
  requirements: {
    minLevel?: number
    requiredStamps?: string[]
    whitelistOnly?: boolean
  }
  rewards: {
    stamp: {
      id: string
      name: string
      description: string
      rarity: "common" | "rare" | "legendary"
      xp: number
      image: string
    }
    additionalRewards?: string[]
  }
  status: "draft" | "published" | "ongoing" | "completed" | "cancelled"
  createdAt: string
  updatedAt: string
  tags: string[]
  socialLinks?: {
    website?: string
    twitter?: string
    discord?: string
  }
}

export interface EventRSVP {
  id: string
  eventId: string
  userAddress: Address
  status: "pending" | "confirmed" | "cancelled" | "attended"
  rsvpDate: string
  checkInDate?: string
  qrCode?: string
  notes?: string
}

export interface EventCheckIn {
  id: string
  eventId: string
  userAddress: Address
  checkInTime: string
  qrCodeData: string
  stampAwarded: boolean
  location?: {
    lat: number
    lng: number
  }
}

export interface CreateEventRequest {
  title: string
  description: string
  location: Event["location"]
  startDate: string
  endDate: string
  image?: string
  category: Event["category"]
  capacity: number
  price: Event["price"]
  requirements?: Event["requirements"]
  rewards: Event["rewards"]
  tags?: string[]
  socialLinks?: Event["socialLinks"]
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string
  status?: Event["status"]
}
