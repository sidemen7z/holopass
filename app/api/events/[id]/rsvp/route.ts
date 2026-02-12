import { type NextRequest, NextResponse } from "next/server"
import { createRSVP, cancelRSVP } from "@/lib/events-api"
import type { Address } from "viem"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { userAddress } = body as { userAddress: Address }

    if (!userAddress) {
      return NextResponse.json({ error: "User address is required" }, { status: 400 })
    }

    const rsvp = await createRSVP(params.id, userAddress)
    return NextResponse.json({ rsvp }, { status: 201 })
  } catch (error) {
    console.error("Error creating RSVP:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create RSVP" },
      { status: 400 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const userAddress = searchParams.get("user") as Address

    if (!userAddress) {
      return NextResponse.json({ error: "User address is required" }, { status: 400 })
    }

    const success = await cancelRSVP(params.id, userAddress)

    if (!success) {
      return NextResponse.json({ error: "RSVP not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error canceling RSVP:", error)
    return NextResponse.json({ error: "Failed to cancel RSVP" }, { status: 500 })
  }
}
