import { AuthGuard } from "@/components/auth-guard"
import { DigitalPassport } from "@/components/digital-passport"
import { Web3PassportDisplay } from "@/components/web3-passport-display"
import { NFTPassportDisplay } from "@/components/nft-passport-display"
import { UserProfileCard } from "@/components/user-profile-card"

export default function PassportPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My HoloPass</h1>
            <p className="text-muted-foreground">Track your digital identity, stamps, and achievements</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <UserProfileCard />
              <Web3PassportDisplay />
            </div>
            <div>
              <NFTPassportDisplay />
            </div>
            <div>
              <DigitalPassport />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
