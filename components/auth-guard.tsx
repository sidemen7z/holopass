"use client"

import type React from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WalletConnectModal } from "@/components/wallet-connect-modal"
import { Shield, Wallet, Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading, isConnected, signIn } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isConnected) {
    return (
      fallback || (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <Wallet className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Connect Your Wallet</CardTitle>
              <p className="text-sm text-muted-foreground">
                Connect your wallet to access your HoloPass and start earning stamps
              </p>
            </CardHeader>
            <CardContent>
              <WalletConnectModal>
                <Button className="w-full">Connect Wallet</Button>
              </WalletConnectModal>
            </CardContent>
          </Card>
        </div>
      )
    )
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Sign In Required</CardTitle>
              <p className="text-sm text-muted-foreground">
                Sign a message to authenticate your identity and access your HoloPass
              </p>
            </CardHeader>
            <CardContent>
              <Button onClick={signIn} className="w-full">
                Sign Message to Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    )
  }

  return <>{children}</>
}
