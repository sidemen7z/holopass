"use client"

import { useState, useEffect } from "react"
import type { Event, EventRSVP } from "@/lib/types/events"
import type { Address } from "viem"

export function useEvents(filters?: { category?: string; search?: string }) {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()

        if (filters?.category) params.append("category", filters.category)
        if (filters?.search) params.append("search", filters.search)

        const response = await fetch(`/api/events?${params}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch events")
        }

        setEvents(data.events)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [filters?.category, filters?.search])

  const rsvpToEvent = async (eventId: string, userAddress: Address): Promise<EventRSVP | null> => {
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to RSVP")
      }

      // Update local event state
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? { ...event, attendeeCount: event.attendeeCount + 1 } : event)),
      )

      return data.rsvp
    } catch (error) {
      console.error("RSVP error:", error)
      return null
    }
  }

  const cancelRSVP = async (eventId: string, userAddress: Address): Promise<boolean> => {
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp?user=${userAddress}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        return false
      }

      // Update local event state
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, attendeeCount: Math.max(0, event.attendeeCount - 1) } : event,
        ),
      )

      return true
    } catch (error) {
      console.error("Cancel RSVP error:", error)
      return false
    }
  }

  return {
    events,
    isLoading,
    error,
    rsvpToEvent,
    cancelRSVP,
  }
}
