import type { Event, EventRSVP, EventCheckIn } from "@/lib/types/events"
import type { Address } from "viem"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { cache } from "react"

export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

const createClient = cache(async () => {
  const cookieStore = await cookies()

  if (!isSupabaseConfigured) {
    console.warn("Supabase environment variables are not set. Using dummy client.")
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
      from: () => ({
        select: () => ({
          order: () => ({ data: [], error: null }),
          eq: () => ({ data: [], error: null }),
          single: () => ({ data: null, error: null }),
        }),
        insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }) }),
        delete: () => ({ eq: () => ({ error: null }) }),
      }),
      rpc: () => Promise.resolve({ data: null, error: null }),
    }
  }

  return createServerComponentClient({ cookies: () => cookieStore })
})

async function getSupabaseClient() {
  return await createClient()
}

// RSVP API
export async function createRSVP(eventId: string, userAddress: Address): Promise<EventRSVP> {
  const supabase = await getSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  const { data: existingRSVP } = await supabase
    .from("rsvps")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .single()

  if (existingRSVP) {
    throw new Error("Already RSVP'd to this event")
  }

  // Check event capacity
  const { data: event } = await supabase.from("events").select("max_attendees").eq("id", eventId).single()

  if (event) {
    const { count } = await supabase
      .from("rsvps")
      .select("*", { count: "exact" })
      .eq("event_id", eventId)
      .eq("status", "confirmed")

    if (count && event.max_attendees && count >= event.max_attendees) {
      throw new Error("Event is at capacity")
    }
  }

  const { data: rsvp, error } = await supabase
    .from("rsvps")
    .insert({
      user_id: user.id,
      event_id: eventId,
      status: "confirmed",
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create RSVP: ${error.message}`)
  }

  return {
    id: rsvp.id,
    eventId: rsvp.event_id,
    userAddress,
    status: rsvp.status,
    rsvpDate: rsvp.created_at,
    qrCode: `holopass-rsvp-${eventId}-${user.id}-${Date.now()}`,
  }
}

export async function getUserRSVPs(userAddress: Address): Promise<EventRSVP[]> {
  const supabase = await getSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  const { data, error } = await supabase.from("rsvps").select("*").eq("user_id", user.id)

  if (error) {
    return []
  }

  return (data || []).map((rsvp) => ({
    id: rsvp.id,
    eventId: rsvp.event_id,
    userAddress,
    status: rsvp.status,
    rsvpDate: rsvp.created_at,
    qrCode: `holopass-rsvp-${rsvp.event_id}-${user.id}`,
  }))
}

export async function cancelRSVP(eventId: string, userAddress: Address): Promise<boolean> {
  const supabase = await getSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return false
  }

  const { error } = await supabase
    .from("rsvps")
    .update({ status: "cancelled" })
    .eq("event_id", eventId)
    .eq("user_id", user.id)

  return !error
}

// Check-in API
export async function checkInToEvent(eventId: string, userAddress: Address, qrCodeData: string): Promise<EventCheckIn> {
  const supabase = await getSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  // Check if user has valid RSVP
  const { data: rsvp } = await supabase
    .from("rsvps")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .eq("status", "confirmed")
    .single()

  if (!rsvp) {
    throw new Error("No valid RSVP found for this event")
  }

  // Check if already checked in
  const { data: existingCheckIn } = await supabase
    .from("check_ins")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .single()

  if (existingCheckIn) {
    throw new Error("Already checked in to this event")
  }

  // Create check-in record
  const { data: checkIn, error } = await supabase
    .from("check_ins")
    .insert({
      user_id: user.id,
      event_id: eventId,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to check in: ${error.message}`)
  }

  // Award stamp
  const { data: event } = await supabase
    .from("events")
    .select("stamp_reward, xp_reward, title")
    .eq("id", eventId)
    .single()

  if (event) {
    await supabase.from("stamps").insert({
      user_id: user.id,
      event_id: eventId,
      stamp_type: "event",
      stamp_name: `${event.title} Attendee`,
      stamp_image: "/placeholder.svg?height=60&width=60",
    })

    // Update user XP
    await supabase.rpc("increment_user_xp", {
      user_id: user.id,
      xp_amount: event.xp_reward || 50,
    })
  }

  return {
    id: checkIn.id,
    eventId: checkIn.event_id,
    userAddress,
    checkInTime: checkIn.checked_in_at,
    qrCodeData,
    stampAwarded: true,
  }
}

export async function getUserCheckIns(userAddress: Address): Promise<EventCheckIn[]> {
  const supabase = await getSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  const { data, error } = await supabase.from("check_ins").select("*").eq("user_id", user.id)

  if (error) {
    return []
  }

  return (data || []).map((checkIn) => ({
    id: checkIn.id,
    eventId: checkIn.event_id,
    userAddress,
    checkInTime: checkIn.checked_in_at,
    qrCodeData: "",
    stampAwarded: true,
  }))
}

// Event API
export async function getEvents(filters?: {
  category?: string
  search?: string
  location?: string
}): Promise<Event[]> {
  const supabase = await getSupabaseClient()

  let query = supabase.from("events").select("*")

  if (filters?.category && filters.category !== "all") {
    query = query.eq("category", filters.category)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.location) {
    query = query.ilike("location", `%${filters.location}%`)
  }

  const { data, error } = await query.order("start_date", { ascending: true })

  if (error) {
    console.error("Error fetching events:", error)
    return []
  }

  return (data || []).map(transformDbEventToEvent)
}

export async function createEvent(eventData: any, organizerAddress: Address): Promise<Event> {
  const supabase = await getSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      title: eventData.title,
      description: eventData.description,
      location: eventData.location,
      start_date: eventData.startDate,
      end_date: eventData.endDate,
      image_url: eventData.image,
      max_attendees: eventData.capacity,
      xp_reward: eventData.rewards?.stamp?.xp || 50,
      stamp_reward: eventData.rewards?.stamp?.name || `${eventData.title} Attendee`,
      organizer_id: user.id,
      category: eventData.category || "conference",
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create event: ${error.message}`)
  }

  return transformDbEventToEvent(event)
}

export async function getEvent(eventId: string): Promise<Event | null> {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase.from("events").select("*").eq("id", eventId).single()

  if (error || !data) {
    return null
  }

  return transformDbEventToEvent(data)
}

export async function updateEvent(eventData: any): Promise<Event | null> {
  const supabase = await getSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  // Check if user is the organizer
  const { data: existingEvent } = await supabase.from("events").select("organizer_id").eq("id", eventData.id).single()

  if (!existingEvent || existingEvent.organizer_id !== user.id) {
    throw new Error("Unauthorized to update this event")
  }

  const { data: event, error } = await supabase
    .from("events")
    .update({
      title: eventData.title,
      description: eventData.description,
      location: eventData.location,
      start_date: eventData.startDate,
      end_date: eventData.endDate,
      image_url: eventData.image,
      max_attendees: eventData.capacity,
      xp_reward: eventData.rewards?.stamp?.xp || 50,
      stamp_reward: eventData.rewards?.stamp?.name || `${eventData.title} Attendee`,
      category: eventData.category || "conference",
    })
    .eq("id", eventData.id)
    .select()
    .single()

  if (error || !event) {
    return null
  }

  return transformDbEventToEvent(event)
}

export async function deleteEvent(eventId: string, organizerAddress: Address): Promise<boolean> {
  const supabase = await getSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  // Check if user is the organizer
  const { data: existingEvent } = await supabase.from("events").select("organizer_id").eq("id", eventId).single()

  if (!existingEvent || existingEvent.organizer_id !== user.id) {
    return false
  }

  const { error } = await supabase.from("events").delete().eq("id", eventId)

  return !error
}

function transformDbEventToEvent(dbEvent: any): Event {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description || "",
    location: {
      name: dbEvent.location || "",
      address: dbEvent.location || "",
      coordinates: { lat: 0, lng: 0 },
    },
    startDate: dbEvent.start_date,
    endDate: dbEvent.end_date,
    image: dbEvent.image_url || "/placeholder.svg?height=400&width=600",
    category: dbEvent.category || "conference",
    capacity: dbEvent.max_attendees || 100,
    attendeeCount: 0, // Would need a separate query to count
    price: { amount: 0, currency: "USD", free: true },
    organizer: {
      address: "0x0000000000000000000000000000000000000000" as Address,
      name: "HoloPass",
      avatar: "/holopass-logo.png",
    },
    requirements: {},
    rewards: {
      stamp: {
        id: `stamp-${dbEvent.id}`,
        name: dbEvent.stamp_reward || `${dbEvent.title} Attendee`,
        description: `Attended ${dbEvent.title}`,
        rarity: "common",
        xp: dbEvent.xp_reward || 50,
        image: "/placeholder.svg?height=60&width=60",
      },
    },
    status: "published",
    createdAt: dbEvent.created_at,
    updatedAt: dbEvent.updated_at,
    tags: [],
    socialLinks: {},
  }
}
