"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, MapPin, Calendar, Star, Zap } from "lucide-react"
import Image from "next/image"

interface Stamp {
  id: string
  name: string
  description: string
  location: string
  date: string
  rarity: "common" | "rare" | "legendary"
  image: string
}

export function DigitalPassport() {
  const [stamps, setStamps] = useState<Stamp[]>([
    {
      id: "1",
      name: "ETH Denver 2024",
      description: "Attended the largest Ethereum event",
      location: "Denver, CO",
      date: "2024-02-28",
      rarity: "rare",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "2",
      name: "Web3 Meetup NYC",
      description: "Participated in Web3 networking event",
      location: "New York, NY",
      date: "2024-03-15",
      rarity: "common",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "3",
      name: "Crypto Coffee Club",
      description: "First purchase at partner cafe",
      location: "San Francisco, CA",
      date: "2024-03-20",
      rarity: "common",
      image: "/placeholder.svg?height=60&width=60",
    },
  ])

  const [level, setLevel] = useState(3)
  const [xp, setXp] = useState(750)
  const [nextLevelXp] = useState(1000)

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Passport Header */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Image src="/holopass-logo.png" alt="HoloPass" width={32} height={32} className="rounded-lg" />
              </div>
              <div>
                <CardTitle className="text-2xl">Your HoloPass</CardTitle>
                <p className="text-muted-foreground">Digital Identity #1337</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-xl font-bold">Level {level}</span>
              </div>
              <Progress value={(xp / nextLevelXp) * 100} className="w-32" />
              <p className="text-sm text-muted-foreground mt-1">
                {xp}/{nextLevelXp} XP
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stamps.length}</div>
            <p className="text-muted-foreground">Stamps Collected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="w-8 h-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold">3</div>
            <p className="text-muted-foreground">Cities Visited</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">12</div>
            <p className="text-muted-foreground">Perks Unlocked</p>
          </CardContent>
        </Card>
      </div>

      {/* Stamps Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>Stamp Collection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stamps.map((stamp) => (
              <Card key={stamp.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Image
                      src={stamp.image || "/placeholder.svg"}
                      alt={stamp.name}
                      width={60}
                      height={60}
                      className="rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm truncate">{stamp.name}</h4>
                        <Badge className={`text-xs ${getRarityColor(stamp.rarity)}`}>{stamp.rarity}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{stamp.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground space-x-2">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{stamp.location}</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground space-x-2 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(stamp.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Level Preview */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-2">Next Level Rewards</h3>
              <p className="text-sm text-muted-foreground">Unlock exclusive perks at Level {level + 1}</p>
            </div>
            <Button variant="outline" className="bg-transparent">
              View Rewards
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
