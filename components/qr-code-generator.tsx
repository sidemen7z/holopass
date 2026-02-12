"use client"

import { useState, useEffect, useRef } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, Download, Copy, Check } from "lucide-react"
import { generateQRCodeData, encodeQRData, createStyledQRCode } from "@/lib/qr-utils"

interface QRCodeGeneratorProps {
  type: "holopass" | "event_checkin" | "stamp_claim"
  eventId?: string
  stampId?: string
}

export function QRCodeGenerator({ type, eventId, stampId }: QRCodeGeneratorProps) {
  const { address } = useAccount()
  const [qrCode, setQrCode] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!address) return

    const qrData = generateQRCodeData({
      type,
      userId: address,
      eventId,
      stampId,
    })

    const qrString = encodeQRData(qrData)
    setQrCode(qrString)

    // Generate styled QR code
    const styledQR = createStyledQRCode(qrString, "/holopass-logo.png")

    if (qrRef.current) {
      qrRef.current.innerHTML = ""
      styledQR.append(qrRef.current)
    }
  }, [address, type, eventId, stampId])

  const handleCopy = async () => {
    if (qrCode) {
      await navigator.clipboard.writeText(qrCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (qrRef.current) {
      const styledQR = createStyledQRCode(qrCode, "/holopass-logo.png")
      styledQR.download({
        name: `holopass-${type}-${Date.now()}`,
        extension: "png",
      })
    }
  }

  const getQRTitle = () => {
    switch (type) {
      case "holopass":
        return "My HoloPass QR"
      case "event_checkin":
        return "Event Check-in QR"
      case "stamp_claim":
        return "Stamp Claim QR"
      default:
        return "QR Code"
    }
  }

  const getQRDescription = () => {
    switch (type) {
      case "holopass":
        return "Share this QR code to verify your HoloPass identity"
      case "event_checkin":
        return "Scan this at the event entrance for check-in"
      case "stamp_claim":
        return "Scan this to claim your event stamp"
      default:
        return "QR code for HoloPass interaction"
    }
  }

  if (!address) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <QrCode className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Connect Wallet</h3>
          <p className="text-sm text-muted-foreground">Connect your wallet to generate QR codes</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <QrCode className="w-5 h-5" />
          <span>{getQRTitle()}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{getQRDescription()}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div
            ref={qrRef}
            className="border rounded-lg p-4 bg-white"
            style={{ minWidth: "300px", minHeight: "300px" }}
          />
        </div>

        <div className="flex items-center justify-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {type.replace("_", " ").toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {address.slice(0, 6)}...{address.slice(-4)}
          </Badge>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleCopy} variant="outline" className="flex-1 bg-transparent">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Copied!" : "Copy Data"}
          </Button>
          <Button onClick={handleDownload} variant="outline" className="flex-1 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          <p>This QR code contains encrypted HoloPass data and expires in 24 hours</p>
        </div>
      </CardContent>
    </Card>
  )
}
