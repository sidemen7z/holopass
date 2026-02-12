import type { Address } from "viem"

// HoloPass NFT Contract ABI (simplified for demo)
export const HOLOPASS_ABI = [
  {
    inputs: [{ name: "to", type: "address" }],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "stampId", type: "uint256" },
    ],
    name: "addStamp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getStamps",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
] as const

// Contract addresses (demo addresses - replace with actual deployed contracts)
export const HOLOPASS_CONTRACTS: Record<number, Address> = {
  1: "0x1234567890123456789012345678901234567890", // Mainnet
  137: "0x1234567890123456789012345678901234567890", // Polygon
  10: "0x1234567890123456789012345678901234567890", // Optimism
  42161: "0x1234567890123456789012345678901234567890", // Arbitrum
  8453: "0x1234567890123456789012345678901234567890", // Base
}

export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  stamps: Array<{
    id: number
    name: string
    description: string
    image: string
    rarity: "common" | "rare" | "legendary"
    timestamp: number
  }>
}
