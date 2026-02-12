import { type NextRequest, NextResponse } from "next/server"
import { checkInToEvent } from "@/lib/events-api"
import type { Address } from "viem"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { userAddress, qrCodeData } = body as { userAddress: Address; qrCodeData: string }

    if (!userAddress || !qrCodeData) {
      return NextResponse.json({ error: "User address and QR code data are required" }, { status: 400 })
    }

    const checkIn = await checkInToEvent(params.id, userAddress, qrCodeData)
    return NextResponse.json({ checkIn }, { status: 201 })
  } catch (error) {
    console.error("Error checking in to event:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to check in" }, { status: 400 })
  }
}
