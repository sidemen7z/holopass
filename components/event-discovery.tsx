"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Calendar, Users, Star, Search } from 'lucide-react'
import Image from "next/image"
import { useEvents } from "@/hooks/use-events"
import { toast } from "sonner"
import { isWeb3Configured } from "@/lib/web3-config"
import { useAccount } from "wagmi"

export function EventDiscovery() {
  const wagmiAccount = useAccount()
  const { address } = wagmiAccount.data || { address: null }

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  
  const { events, isLoading, error, rsvpToEvent } = useEvents({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    search: searchTerm || undefined,
  })

  const categories = ["all", "conference", "meetup", "art", "workshop"]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
      case "rare":
        return "text-purple-500 bg-purple-500/10 border-purple-500/20"
      default:
        return "text-blue-500 bg-blue-500/10 border-blue-500/20"
    }
  }

  const handleRSVP = async (eventId: string) => {
    if (!isWeb3Configured) {
      toast.error("Web3 wallet connection is not configured. Please set up WalletConnect Project ID.")
      return
    }

    if (!address) {
      toast.error("Please connect your wallet to RSVP")
      return
    }

    try {
      const rsvp = await rsvpToEvent(eventId, address)
      if (rsvp) {
        toast.success("RSVP confirmed! You'll receive a QR code for check-in.")
      } else {
        toast.error("Failed to RSVP. Please try again.")
      }
    } catch (error) {
      toast.error("Failed to RSVP. Please try again.")
    }
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-red-500">Error loading events: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Web3 Configuration Warning */}
      {!isWeb3Configured && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="py-4">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> Web3 wallet connection is not configured. Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to enable wallet features.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Discover Events</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p>Loading events...</p>
          </CardContent>
        </Card>
      )}

      {/* Events Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge className={getRarityColor(event.rewards?.stamp?.rarity || "common")}>
                    {event.rewards?.stamp?.rarity || "common"}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location?.name || event.location_name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.startDate || event.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{event.attendeeCount || 0} attending</span>
                  </div>
                </div>

                {event.rewards?.stamp && (
                  <div className="bg-primary/5 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{event.rewards.stamp.name}</p>
                        <p className="text-xs text-muted-foreground">+{event.rewards.stamp.xp} XP</p>
                      </div>
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                )}

                <Button 
                  onClick={() => handleRSVP(event.id)} 
                  className="w-full"
                  disabled={!isWeb3Configured}
                >
                  {isWeb3Configured ? "RSVP Now" : "Web3 Setup Required"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && events.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
