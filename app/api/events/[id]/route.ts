import { type NextRequest, NextResponse } from "next/server"
import { getEvent, updateEvent, deleteEvent } from "@/lib/events-api"
import type { UpdateEventRequest } from "@/lib/types/events"
import type { Address } from "viem"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const event = await getEvent(params.id)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ event })
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const eventData = { ...body, id: params.id } as UpdateEventRequest

    const event = await updateEvent(eventData)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ event })
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const organizerAddress = searchParams.get("organizer") as Address

    if (!organizerAddress) {
      return NextResponse.json({ error: "Organizer address is required" }, { status: 400 })
    }

    const success = await deleteEvent(params.id, organizerAddress)

    if (!success) {
      return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
