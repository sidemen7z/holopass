"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Star, Trophy, Calendar, LogOut } from "lucide-react"

export function UserProfileCard() {
  const { user, signOut, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return null
  }

  const nextLevelXP = user.level * 500
  const currentLevelXP = (user.level - 1) * 500
  const progressXP = user.xp - currentLevelXP
  const progressToNext = nextLevelXP - currentLevelXP

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.ensName || "User"} />
            <AvatarFallback>
              <User className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">
              {user.ensName || `${user.address.slice(0, 6)}...${user.address.slice(-4)}`}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs">
                Level {user.level}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {user.stampsCount} Stamps
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress to Level {user.level + 1}</span>
            <span className="text-sm text-muted-foreground">
              {progressXP}/{progressToNext} XP
            </span>
          </div>
          <Progress value={(progressXP / progressToNext) * 100} />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center mb-1">
              <Star className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="text-lg font-bold">{user.xp}</div>
            <div className="text-xs text-muted-foreground">Total XP</div>
          </div>
          <div>
            <div className="flex items-center justify-center mb-1">
              <Trophy className="w-4 h-4 text-primary" />
            </div>
            <div className="text-lg font-bold">{user.stampsCount}</div>
            <div className="text-xs text-muted-foreground">Stamps</div>
          </div>
          <div>
            <div className="flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4 text-secondary" />
            </div>
            <div className="text-lg font-bold">{Math.floor((Date.now() - user.joinedAt) / (1000 * 60 * 60 * 24))}</div>
            <div className="text-xs text-muted-foreground">Days</div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={signOut} variant="outline" size="sm" className="w-full bg-transparent">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
