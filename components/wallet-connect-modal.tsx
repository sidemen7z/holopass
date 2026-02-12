"use client"

import type React from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wallet, LogOut, User } from "lucide-react"

interface WalletConnectModalProps {
  children: React.ReactNode
}

export function WalletConnectModal({ children }: WalletConnectModalProps) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Wallet Connected
            </DialogTitle>
            <DialogDescription>
              Your HoloPass is ready! Address: {address.slice(0, 6)}...{address.slice(-4)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button onClick={() => window.open("/passport", "_self")} className="w-full">
              View My HoloPass
            </Button>
            <Button onClick={() => disconnect()} variant="outline" className="w-full justify-start">
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription>Choose your preferred wallet to claim your HoloPass NFT</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <ConnectButton />
        </div>
      </DialogContent>
    </Dialog>
  )
}
