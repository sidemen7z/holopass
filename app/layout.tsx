import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "HoloPass - Your Digital Identity Passport",
  description:
    "Unlock exclusive access to events, communities, and retail experiences with HoloPass - the multichain digital identity NFT.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
