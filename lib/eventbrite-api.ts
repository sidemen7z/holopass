import type { Event } from "@/lib/types/events"
import type { Address } from "viem"

// Eventbrite API configuration
const EVENTBRITE_API_BASE = "https://www.eventbriteapi.com/v3"
const EVENTBRITE_TOKEN = process.env.EVENTBRITE_PRIVATE_TOKEN

interface EventbriteEvent {
  id: string
  name: {
    text: string
  }
  description: {
    text: string
  }
  start: {
    utc: string
    local: string
  }
  end: {
    utc: string
    local: string
  }
  venue?: {
    name: string
    address: {
      address_1: string
      city: string
      region: string
      country: string
    }
  }
  logo?: {
    url: string
  }
  capacity?: number
  category_id?: string
  organizer_id: string
  url: string
}

interface EventbriteResponse {
  events: EventbriteEvent[]
  pagination: {
    page_number: number
    page_count: number
    page_size: number
    object_count: number
  }
}

// Fallback to demo events if Eventbrite API is not available
const DEMO_EVENTS: Event[] = [
  {
    id: "demo-1",
    title: "Web3 Developer Meetup",
    description:
      "Join us for an evening of Web3 development discussions, networking, and demos. Perfect for developers interested in blockchain technology.",
    location: {
      name: "Tech Hub Downtown",
      address: "123 Innovation St, San Francisco, CA",
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
    image: "/placeholder.svg?height=400&width=600",
    category: "conference",
    capacity: 100,
    attendeeCount: 45,
    price: { amount: 0, currency: "USD", free: true },
    organizer: {
      address: "0x1234567890123456789012345678901234567890" as Address,
      name: "Web3 SF",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    requirements: {},
    rewards: {
      stamp: {
        id: "stamp-web3-meetup",
        name: "Web3 Pioneer",
        description: "Attended Web3 Developer Meetup",
        rarity: "common",
        xp: 75,
        image: "/placeholder.svg?height=60&width=60",
      },
    },
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["web3", "blockchain", "developer", "networking"],
    socialLinks: {},
  },
  {
    id: "demo-2",
    title: "NFT Art Gallery Opening",
    description:
      "Experience the future of digital art at our exclusive NFT gallery opening. Meet artists, collectors, and fellow enthusiasts.",
    location: {
      name: "Digital Arts Center",
      address: "456 Creative Ave, New York, NY",
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    image: "/placeholder.svg?height=400&width=600",
    category: "art",
    capacity: 150,
    attendeeCount: 89,
    price: { amount: 25, currency: "USD", free: false },
    organizer: {
      address: "0x9876543210987654321098765432109876543210" as Address,
      name: "NFT Collective",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    requirements: {},
    rewards: {
      stamp: {
        id: "stamp-nft-gallery",
        name: "Art Connoisseur",
        description: "Attended NFT Art Gallery Opening",
        rarity: "rare",
        xp: 100,
        image: "/placeholder.svg?height=60&width=60",
      },
    },
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["nft", "art", "gallery", "digital"],
    socialLinks: {},
  },
  {
    id: "demo-3",
    title: "DeFi Summit 2024",
    description:
      "The premier conference for decentralized finance. Learn from industry leaders, discover new protocols, and network with DeFi enthusiasts.",
    location: {
      name: "Convention Center",
      address: "789 Conference Blvd, Austin, TX",
      coordinates: { lat: 30.2672, lng: -97.7431 },
    },
    startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
    image: "/placeholder.svg?height=400&width=600",
    category: "conference",
    capacity: 500,
    attendeeCount: 234,
    price: { amount: 299, currency: "USD", free: false },
    organizer: {
      address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" as Address,
      name: "DeFi Foundation",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    requirements: {},
    rewards: {
      stamp: {
        id: "stamp-defi-summit",
        name: "DeFi Expert",
        description: "Attended DeFi Summit 2024",
        rarity: "legendary",
        xp: 200,
        image: "/placeholder.svg?height=60&width=60",
      },
    },
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["defi", "finance", "summit", "conference"],
    socialLinks: {},
  },
]

async function fetchFromEventbrite(endpoint: string): Promise<any> {
  if (!EVENTBRITE_TOKEN) {
    console.warn("Eventbrite API token not configured, using demo events")
    return null
  }

  try {
    const response = await fetch(`${EVENTBRITE_API_BASE}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${EVENTBRITE_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Eventbrite API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching from Eventbrite:", error)
    return null
  }
}

function transformEventbriteEvent(event: EventbriteEvent): Event {
  return {
    id: event.id,
    title: event.name.text,
    description: event.description?.text || "",
    location: {
      name: event.venue?.name || "Online Event",
      address: event.venue
        ? `${event.venue.address.address_1}, ${event.venue.address.city}, ${event.venue.address.region}`
        : "Online",
      coordinates: { lat: 0, lng: 0 },
    },
    startDate: event.start.utc,
    endDate: event.end.utc,
    image: event.logo?.url || "/placeholder.svg?height=400&width=600",
    category: "conference",
    capacity: event.capacity || 100,
    attendeeCount: 0,
    price: { amount: 0, currency: "USD", free: true },
    organizer: {
      address: "0x0000000000000000000000000000000000000000" as Address,
      name: "Eventbrite Organizer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    requirements: {},
    rewards: {
      stamp: {
        id: `stamp-${event.id}`,
        name: `${event.name.text} Attendee`,
        description: `Attended ${event.name.text}`,
        rarity: "common",
        xp: 50,
        image: "/placeholder.svg?height=60&width=60",
      },
    },
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [],
    socialLinks: {},
  }
}

export async function getEvents(filters?: {
  category?: string
  location?: string
  dateRange?: { start: string; end: string }
  search?: string
}): Promise<Event[]> {
  // Try to fetch from Eventbrite API
  const data = await fetchFromEventbrite("/events/search/?expand=venue,organizer&location.address=San Francisco")

  if (!data || !data.events) {
    // Return demo events if API is not available
    let events = [...DEMO_EVENTS]

    // Apply filters to demo events
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase()
      events = events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm) || event.description.toLowerCase().includes(searchTerm),
      )
    }

    if (filters?.category && filters.category !== "all") {
      events = events.filter((event) => event.category === filters.category)
    }

    return events
  }

  // Transform Eventbrite events
  return data.events.map(transformEventbriteEvent)
}

export async function getEvent(id: string): Promise<Event | null> {
  // Check if it's a demo event
  const demoEvent = DEMO_EVENTS.find((event) => event.id === id)
  if (demoEvent) {
    return demoEvent
  }

  // Try to fetch from Eventbrite
  const data = await fetchFromEventbrite(`/events/${id}/?expand=venue,organizer`)

  if (!data) {
    return null
  }

  return transformEventbriteEvent(data)
}

// For now, we'll keep the RSVP and check-in functionality using our custom system
// since these require user authentication and HoloPass-specific features
export { createRSVP, getUserRSVPs, cancelRSVP, checkInToEvent, getUserCheckIns } from "./events-api"
