import QRCodeStyling from "qr-code-styling"
import QRCode from "qrcode"

export interface QRCodeData {
  type: "holopass" | "event_checkin" | "stamp_claim"
  userId?: string
  eventId?: string
  stampId?: string
  timestamp: number
  signature?: string
}

export function generateQRCodeData(data: Omit<QRCodeData, "timestamp">): QRCodeData {
  return {
    ...data,
    timestamp: Date.now(),
  }
}

export function encodeQRData(data: QRCodeData): string {
  return JSON.stringify(data)
}

export function decodeQRData(qrString: string): QRCodeData | null {
  try {
    const data = JSON.parse(qrString)
    if (data && typeof data === "object" && data.type && data.timestamp) {
      return data as QRCodeData
    }
    return null
  } catch {
    return null
  }
}

export async function generateQRCodeImage(data: string, size = 256): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      width: size,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    throw error
  }
}

export function createStyledQRCode(data: string, logoUrl?: string): QRCodeStyling {
  return new QRCodeStyling({
    width: 300,
    height: 300,
    type: "svg",
    data,
    image: logoUrl,
    dotsOptions: {
      color: "#2563eb",
      type: "rounded",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 20,
    },
    cornersSquareOptions: {
      color: "#0ea5e9",
      type: "extra-rounded",
    },
    cornersDotOptions: {
      color: "#2563eb",
      type: "dot",
    },
  })
}
