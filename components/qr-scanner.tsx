"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, Scan, CheckCircle, MapPin, Calendar, AlertCircle } from "lucide-react"
import { QrScanner } from "@yudiel/react-qr-scanner"
import { toast } from "sonner"

export function QRScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const { address } = useAccount()

  const handleScan = async (result: string) => {
    if (!result || !address) return

    try {
      const qrData = JSON.parse(result)

      if (qrData.type === "holopass_event_checkin" && qrData.eventId) {
        const response = await fetch(`/api/events/${qrData.eventId}/checkin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userAddress: address, qrCodeData: result }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Check-in failed")
        }

        // Get event details
        const eventResponse = await fetch(`/api/events/${qrData.eventId}`)
        const eventData = await eventResponse.json()

        if (eventResponse.ok && eventData.event) {
          setScanResult({
            eventName: eventData.event.title,
            location: eventData.event.location.name,
            date: new Date(eventData.event.startDate).toLocaleDateString(),
            type: eventData.event.category,
            verified: true,
            stamp: {
              name: eventData.event.rewards.stamp.name,
              rarity: eventData.event.rewards.stamp.rarity,
              xp: eventData.event.rewards.stamp.xp,
            },
          })

          toast.success("Successfully checked in!")
        }
      } else {
        setError("Invalid QR code format")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to process QR code"
      setError(errorMessage)
      toast.error(errorMessage)
    }

    setIsScanning(false)
  }

  const handleError = (error: Error) => {
    setError("Camera access failed. Please check permissions.")
  }

  const handleGenerateQR = () => {
    window.open("/passport", "_blank")
  }

  if (!address) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <QrCode className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Connect Wallet</h3>
          <p className="text-sm text-muted-foreground">Connect your wallet to use QR code features</p>
        </CardContent>
      </Card>
    )
  }

  if (scanResult) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
          <CardTitle className="text-green-700">Check-in Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-lg">{scanResult.eventName}</h3>
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground mt-2">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{scanResult.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{scanResult.date}</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 text-center">
            <h4 className="font-semibold mb-2">New Stamp Earned!</h4>
            <p className="text-sm text-muted-foreground mb-2">{scanResult.stamp.name}</p>
            <div className="flex items-center justify-center space-x-2">
              <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">{scanResult.stamp.rarity}</Badge>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">+{scanResult.stamp.xp} XP</Badge>
            </div>
          </div>

          <Button onClick={() => setScanResult(null)} className="w-full">
            Continue
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <QrCode className="w-12 h-12 text-primary mx-auto mb-2" />
        <CardTitle>QR Code Scanner</CardTitle>
        <p className="text-sm text-muted-foreground">Scan QR codes at events to check-in and earn stamps</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          {isScanning ? (
            <QrScanner
              onDecode={handleScan}
              onError={handleError}
              constraints={{ facingMode: "environment" }}
              containerStyle={{ width: "100%", height: "100%" }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Scan className="w-16 h-16 mx-auto mb-2" />
                <p className="text-sm">Camera view will appear here</p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <Button
            onClick={() => {
              setIsScanning(!isScanning)
              setError(null)
            }}
            disabled={isScanning}
            className="w-full"
          >
            {isScanning ? "Stop Scanning" : "Start Scanning"}
          </Button>

          <Button variant="outline" onClick={handleGenerateQR} className="w-full bg-transparent">
            <QrCode className="w-4 h-4 mr-2" />
            View My QR Codes
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          <p>Point your camera at a HoloPass QR code to check-in to events and earn stamps</p>
        </div>
      </CardContent>
    </Card>
  )
}
