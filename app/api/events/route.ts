import { type NextRequest, NextResponse } from "next/server"
import { getEvents, createEvent } from "@/lib/events-api"
import type { CreateEventRequest } from "@/lib/types/events"
import type { Address } from "viem"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const search = searchParams.get("search") || undefined
    const location = searchParams.get("location") || undefined

    const events = await getEvents({
      category,
      search,
      location,
    })

    return NextResponse.json({ events })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { organizerAddress, ...eventData } = body as CreateEventRequest & { organizerAddress: Address }

    if (!organizerAddress) {
      return NextResponse.json({ error: "Organizer address is required" }, { status: 400 })
    }

    const event = await createEvent(eventData, organizerAddress)
    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
