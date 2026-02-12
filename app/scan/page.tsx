import { QRCodeScanner } from "@/components/qr-code-scanner"

export default function ScanPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Event Check-in</h1>
          <p className="text-muted-foreground">Scan QR codes to check-in to events and earn stamps</p>
        </div>
        <QRCodeScanner />
      </div>
    </div>
  )
}
