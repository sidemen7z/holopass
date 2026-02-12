"use client"

import { useHoloPassNFT } from "@/hooks/use-holopass-nft"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, ExternalLink, Loader2 } from "lucide-react"
import Image from "next/image"

export function NFTPassportDisplay() {
  const {
    hasNFT,
    tokenId,
    metadata,
    isLoading,
    mintNFT,
    isMinting,
    isConfirming,
    isConfirmed,
    contractAddress,
    chain,
  } = useHoloPassNFT()

  if (isLoading) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your HoloPass NFT...</p>
        </CardContent>
      </Card>
    )
  }

  if (!hasNFT) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image src="/holopass-logo.png" alt="HoloPass" width={32} height={32} className="rounded-lg" />
          </div>
          <CardTitle>Claim Your HoloPass NFT</CardTitle>
          <p className="text-sm text-muted-foreground">
            Mint your unique HoloPass NFT to start collecting stamps and unlocking exclusive access
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={mintNFT} disabled={isMinting || isConfirming} className="w-full">
            {isMinting || isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isMinting ? "Minting..." : "Confirming..."}
              </>
            ) : (
              "Mint HoloPass NFT"
            )}
          </Button>

          {isConfirmed && (
            <div className="text-center text-sm text-green-600">✅ HoloPass NFT minted successfully!</div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            <p>Network: {chain?.name}</p>
            {contractAddress && (
              <a
                href={`${chain?.blockExplorers?.default?.url}/address/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline mt-1"
              >
                View Contract
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!metadata) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Loading NFT metadata...</p>
        </CardContent>
      </Card>
    )
  }

  const level = (metadata.attributes.find((attr) => attr.trait_type === "Level")?.value as number) || 1
  const xp = (metadata.attributes.find((attr) => attr.trait_type === "XP")?.value as number) || 0
  const nextLevelXp = level * 500

  return (
    <div className="space-y-6">
      {/* NFT Header */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Image
                  src={metadata.image || "/placeholder.svg"}
                  alt={metadata.name}
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </div>
              <div>
                <CardTitle className="text-xl">{metadata.name}</CardTitle>
                <p className="text-sm text-muted-foreground">Token ID: {tokenId?.toString()}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-bold">Level {level}</span>
              </div>
              <Progress value={(xp / nextLevelXp) * 100} className="w-24" />
              <p className="text-xs text-muted-foreground mt-1">
                {xp}/{nextLevelXp} XP
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* On-Chain Stamps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>On-Chain Stamps</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {metadata.stamps.map((stamp) => (
              <div key={stamp.id} className="flex items-center space-x-3 p-3 bg-card rounded-lg border">
                <Image
                  src={stamp.image || "/placeholder.svg"}
                  alt={stamp.name}
                  width={40}
                  height={40}
                  className="rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm truncate">{stamp.name}</h4>
                    <Badge
                      className={`text-xs ${
                        stamp.rarity === "legendary"
                          ? "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
                          : stamp.rarity === "rare"
                            ? "text-purple-500 bg-purple-500/10 border-purple-500/20"
                            : "text-blue-500 bg-blue-500/10 border-blue-500/20"
                      }`}
                    >
                      {stamp.rarity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{stamp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contract Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Smart Contract</span>
            <a
              href={`${chain?.blockExplorers?.default?.url}/address/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:underline"
            >
              {contractAddress?.slice(0, 6)}...{contractAddress?.slice(-4)}
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
