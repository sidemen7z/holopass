"use client"

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { HOLOPASS_ABI, HOLOPASS_CONTRACTS, type NFTMetadata } from "@/lib/contracts"
import { useState, useEffect } from "react"

export function useHoloPassNFT() {
  const { address, chain } = useAccount()
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const contractAddress = chain?.id ? HOLOPASS_CONTRACTS[chain.id] : undefined

  // Read user's NFT balance
  const { data: balance } = useReadContract({
    address: contractAddress,
    abi: HOLOPASS_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress,
    },
  })

  // Read user's first token ID
  const { data: tokenId } = useReadContract({
    address: contractAddress,
    abi: HOLOPASS_ABI,
    functionName: "tokenOfOwnerByIndex",
    args: address && balance && balance > 0n ? [address, 0n] : undefined,
    query: {
      enabled: !!address && !!contractAddress && !!balance && balance > 0n,
    },
  })

  // Read token URI
  const { data: tokenURI } = useReadContract({
    address: contractAddress,
    abi: HOLOPASS_ABI,
    functionName: "tokenURI",
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: !!tokenId && !!contractAddress,
    },
  })

  // Read stamps for the token
  const { data: stamps } = useReadContract({
    address: contractAddress,
    abi: HOLOPASS_ABI,
    functionName: "getStamps",
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: !!tokenId && !!contractAddress,
    },
  })

  // Write contract functions
  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Fetch metadata from IPFS/HTTP
  useEffect(() => {
    if (tokenURI) {
      setIsLoading(true)
      fetch(tokenURI)
        .then((res) => res.json())
        .then((data: NFTMetadata) => {
          setMetadata(data)
        })
        .catch((error) => {
          console.error("Failed to fetch NFT metadata:", error)
          // Fallback to mock data for demo
          setMetadata({
            name: "HoloPass #1337",
            description: "Your multichain digital identity passport",
            image: "/holopass-logo.png",
            attributes: [
              { trait_type: "Level", value: 3 },
              { trait_type: "XP", value: 750 },
              { trait_type: "Stamps", value: stamps?.length || 0 },
            ],
            stamps: [
              {
                id: 1,
                name: "ETH Denver 2024",
                description: "Attended the largest Ethereum event",
                image: "/placeholder.svg?height=60&width=60",
                rarity: "rare",
                timestamp: Date.now() - 86400000,
              },
              {
                id: 2,
                name: "Web3 Meetup NYC",
                description: "Participated in Web3 networking event",
                image: "/placeholder.svg?height=60&width=60",
                rarity: "common",
                timestamp: Date.now() - 172800000,
              },
            ],
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [tokenURI, stamps])

  const mintNFT = () => {
    if (!address || !contractAddress) return

    writeContract({
      address: contractAddress,
      abi: HOLOPASS_ABI,
      functionName: "mint",
      args: [address],
    })
  }

  const addStamp = (stampId: number) => {
    if (!tokenId || !contractAddress) return

    writeContract({
      address: contractAddress,
      abi: HOLOPASS_ABI,
      functionName: "addStamp",
      args: [tokenId, BigInt(stampId)],
    })
  }

  return {
    // NFT data
    hasNFT: balance && balance > 0n,
    tokenId,
    metadata,
    stamps,
    isLoading,

    // Contract interactions
    mintNFT,
    addStamp,
    isMinting: isPending,
    isConfirming,
    isConfirmed,

    // Contract info
    contractAddress,
    chain,
  }
}
