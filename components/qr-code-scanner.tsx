"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { QrScanner } from "@yudiel/react-qr-scanner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Scan, CheckCircle, AlertCircle, Camera, CameraOff } from "lucide-react"
import { decodeQRData } from "@/lib/qr-utils"
import { toast } from "sonner"

export function QRCodeScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [error, setError] = useState<string>("")
  const { address } = useAccount()

  const handleScan = async (result: string) => {
    if (!address) {
      setError("Please connect your wallet first")
      return
    }

    try {
      const qrData = decodeQRData(result)

      if (!qrData) {
        setError("Invalid QR code format")
        return
      }

      // Check if QR code is expired (24 hours)
      const isExpired = Date.now() - qrData.timestamp > 24 * 60 * 60 * 1000
      if (isExpired) {
        setError("QR code has expired")
        return
      }

      if (qrData.type === "event_checkin" && qrData.eventId) {
        const response = await fetch(`/api/events/${qrData.eventId}/checkin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userAddress: address, qrCodeData: result }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Check-in failed")
        }

        // Get event details for display
        const eventResponse = await fetch(`/api/events/${qrData.eventId}`)
        const eventData = await eventResponse.json()

        if (eventResponse.ok && eventData.event) {
          setScanResult({
            type: "event_checkin",
            eventName: eventData.event.title,
            location: eventData.event.location.name,
            date: new Date(eventData.event.startDate).toLocaleDateString(),
            stamp: {
              name: eventData.event.rewards.stamp.name,
              rarity: eventData.event.rewards.stamp.rarity,
              xp: eventData.event.rewards.stamp.xp,
            },
            checkIn: data.checkIn,
          })

          toast.success("Successfully checked in to event!")
        }
      } else {
        // Handle other QR code types
        setScanResult({
          type: qrData.type,
          userId: qrData.userId,
          eventId: qrData.eventId,
          stampId: qrData.stampId,
          timestamp: qrData.timestamp,
        })
      }

      setIsScanning(false)
      setError("")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to process QR code"
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const handleError = (error: Error) => {
    console.error("QR Scanner error:", error)
    setError("Camera access denied or not available")
  }

  const startScanning = () => {
    if (!address) {
      toast.error("Please connect your wallet first")
      return
    }
    setIsScanning(true)
    setError("")
    setScanResult(null)
  }

  const stopScanning = () => {
    setIsScanning(false)
  }

  const resetScanner = () => {
    setScanResult(null)
    setError("")
  }

  if (!address) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Connect Wallet</h3>
          <p className="text-sm text-muted-foreground">Connect your wallet to use QR code scanning</p>
        </CardContent>
      </Card>
    )
  }

  if (scanResult) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
          <CardTitle className="text-green-700">
            {scanResult.type === "event_checkin" ? "Check-in Successful!" : "Scan Successful!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Badge className="mb-2">{scanResult.type.replace("_", " ").toUpperCase()}</Badge>

            {scanResult.type === "event_checkin" && (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{scanResult.eventName}</h3>
                <div className="text-sm text-muted-foreground">
                  <p>{scanResult.location}</p>
                  <p>{scanResult.date}</p>
                </div>
              </div>
            )}

            <div className="space-y-2 text-sm mt-4">
              {scanResult.userId && (
                <div>
                  <span className="font-medium">User: </span>
                  {scanResult.userId.slice(0, 6)}...{scanResult.userId.slice(-4)}
                </div>
              )}
              {scanResult.eventId && (
                <div>
                  <span className="font-medium">Event: </span>
                  {scanResult.eventId}
                </div>
              )}
              {scanResult.stampId && (
                <div>
                  <span className="font-medium">Stamp: </span>
                  {scanResult.stampId}
                </div>
              )}
              <div>
                <span className="font-medium">Scanned: </span>
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          {scanResult.stamp && (
            <div className="bg-primary/5 rounded-lg p-4 text-center">
              <h4 className="font-semibold mb-2">New Stamp Earned!</h4>
              <p className="text-sm text-muted-foreground mb-2">{scanResult.stamp.name}</p>
              <div className="flex items-center justify-center space-x-2">
                <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                  {scanResult.stamp.rarity}
                </Badge>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">+{scanResult.stamp.xp} XP</Badge>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button onClick={resetScanner} variant="outline" className="flex-1 bg-transparent">
              Scan Another
            </Button>
            <Button onClick={() => window.open("/passport", "_self")} className="flex-1">
              View Passport
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <Scan className="w-12 h-12 text-primary mx-auto mb-2" />
        <CardTitle>QR Code Scanner</CardTitle>
        <p className="text-sm text-muted-foreground">Scan HoloPass QR codes to check-in and earn stamps</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          {isScanning ? (
            <QrScanner
              onDecode={handleScan}
              onError={handleError}
              constraints={{
                facingMode: "environment",
              }}
              containerStyle={{
                width: "100%",
                height: "100%",
              }}
              videoStyle={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Camera className="w-16 h-16 mx-auto mb-2" />
                <p className="text-sm">Camera will appear here</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {!isScanning ? (
            <Button onClick={startScanning} className="w-full">
              <Camera className="w-4 h-4 mr-2" />
              Start Scanning
            </Button>
          ) : (
            <Button onClick={stopScanning} variant="outline" className="w-full bg-transparent">
              <CameraOff className="w-4 h-4 mr-2" />
              Stop Scanning
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center">
          <p>Point your camera at a HoloPass QR code to scan</p>
          <p className="mt-1">Supports event check-ins, stamp claims, and identity verification</p>
        </div>
      </CardContent>
    </Card>
  )
}
