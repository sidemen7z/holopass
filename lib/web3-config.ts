"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains"

// Check if we have a valid WalletConnect project ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

// Only create config if we have a valid project ID
export const config = projectId && projectId !== "demo-project-id" 
  ? getDefaultConfig({
      appName: "HoloPass",
      projectId,
      chains: [mainnet, polygon, optimism, arbitrum, base],
      ssr: true,
    })
  : null

// Export a flag to check if Web3 is configured
export const isWeb3Configured = !!config
