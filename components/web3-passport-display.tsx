"use client"

import { useAccount, useBalance, useEnsName } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, ExternalLink } from "lucide-react"
import Image from "next/image"

export function Web3PassportDisplay() {
  const { address, isConnected, chain } = useAccount()
  const { data: balance } = useBalance({ address })
  const { data: ensName } = useEnsName({ address })

  if (!isConnected || !address) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-sm text-muted-foreground">
            Connect your wallet to view your HoloPass NFT and earned stamps
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Image src="/holopass-logo.png" alt="HoloPass" width={32} height={32} className="rounded-lg" />
        </div>
        <CardTitle>Your HoloPass NFT</CardTitle>
        <p className="text-sm text-muted-foreground">{ensName || `${address.slice(0, 6)}...${address.slice(-4)}`}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-primary/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Network</span>
            <Badge variant="outline">{chain?.name || "Unknown"}</Badge>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Balance</span>
            <span className="text-sm">
              {balance ? `${Number.parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : "0.0000 ETH"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">HoloPass ID</span>
            <span className="text-sm">#1337</span>
          </div>
        </div>

        <div className="text-center">
          <a
            href={`${chain?.blockExplorers?.default?.url}/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            View on Explorer
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
