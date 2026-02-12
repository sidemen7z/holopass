"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Ticket, Users, Gift, Zap, Shield, Star, ArrowRight, QrCode, Trophy, Play } from "lucide-react"
import Image from "next/image"
import { WalletConnectModal } from "@/components/wallet-connect-modal"
import { NewsletterSignup } from "@/components/newsletter-signup"

export default function HoloPassLanding() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Image src="/holopass-logo.png" alt="HoloPass Logo" width={40} height={40} className="rounded-lg" />
              <span className="text-xl font-bold text-foreground">HoloPass</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/passport" className="text-muted-foreground hover:text-foreground transition-colors">
                My Passport
              </a>
              <a href="/events" className="text-muted-foreground hover:text-foreground transition-colors">
                Events
              </a>
              <a href="/scan" className="text-muted-foreground hover:text-foreground transition-colors">
                Scan
              </a>
              <button
                onClick={() => scrollToSection("features")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("community")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Community
              </button>
            </nav>
            <WalletConnectModal>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                Get Started
              </Button>
            </WalletConnectModal>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-background via-card to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-6 bg-secondary/10 text-secondary border-secondary/20 animate-pulse"
            >
              <Zap className="w-4 h-4 mr-2" />
              Multichain Digital Identity
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Unlock Your{" "}
              <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Digital Identity
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Experience exclusive access to events, communities, and retail with HoloPass - the gamified NFT passport
              that evolves with every adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <WalletConnectModal>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-200"
                >
                  Claim Your HoloPass
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </WalletConnectModal>
              <Button
                variant="outline"
                size="lg"
                className="border-border hover:bg-card px-8 py-3 bg-transparent group"
                onClick={() => alert("Demo video coming soon!")}
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Your Passport to the Future</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              HoloPass combines the excitement of collectibles with the practicality of a universal access card
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Ticket className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Event & Venue Access</CardTitle>
                <CardDescription>
                  Scan your unique QR code via WalletConnect for seamless entry to concerts, meetups, conferences, and
                  exclusive lounges.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg hover:shadow-secondary/5 transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-xl font-bold">Exclusive Communities</CardTitle>
                <CardDescription>
                  Access token-gated Discord channels, participate in DAO voting, and get early access to beta products
                  and trials.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Gift className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl font-bold">Retail & Hospitality Perks</CardTitle>
                <CardDescription>
                  Partner cafes, stores, hotels, and travel services instantly verify your NFT for discounts and
                  exclusive deals.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Dynamic Gamification</CardTitle>
                <CardDescription>
                  Earn on-chain stamps for attending events and completing challenges. Watch your passport evolve and
                  unlock higher-tier perks.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg hover:shadow-secondary/5 transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-xl font-bold">QR Verification</CardTitle>
                <CardDescription>
                  Simple mobile scanning for event check-ins and instant verification at partner locations worldwide.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl font-bold">Blockchain Security</CardTitle>
                <CardDescription>
                  Built on Ethereum with WalletConnect integration, ensuring your digital identity is secure and truly
                  yours.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Gamified Experiences Await</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Collect stamps, unlock perks, and showcase your achievements across the digital and physical worlds
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Claim Your HoloPass</h3>
              <p className="text-muted-foreground">
                Mint your unique HoloPass NFT and connect your wallet to start your journey into the future of digital
                identity.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/20 transition-colors duration-300">
                <span className="text-2xl font-bold text-secondary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Collect Stamps</h3>
              <p className="text-muted-foreground">
                Attend events, visit partner locations, and complete challenges to earn unique on-chain stamps that
                upgrade your passport.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors duration-300">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Unlock Exclusive Access</h3>
              <p className="text-muted-foreground">
                Use your evolved HoloPass to access premium events, exclusive communities, and special retail offers
                worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Join a Thriving Community</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with fellow HoloPass holders and showcase your achievements across social platforms
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-primary/20 transition-colors">
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">FOMO Collectibles</h3>
                    <p className="text-muted-foreground">
                      Limited-time event stamps only available in person or during exclusive live streams.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-secondary/20 transition-colors">
                    <Globe className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Social Flex</h3>
                    <p className="text-muted-foreground">
                      Integrate stamps into your Twitter, Lens, or Farcaster profile to showcase achievements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-accent/20 transition-colors">
                    <Users className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Proof of Participation</h3>
                    <p className="text-muted-foreground">
                      Stamps serve as verifiable proof-of-participation, building trust and brand loyalty.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 text-center border border-primary/10">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image src="/holopass-logo.png" alt="HoloPass" width={48} height={48} className="rounded-lg" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of HoloPass holders exploring the future of digital identity and exclusive access.
              </p>
              <WalletConnectModal>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transform hover:scale-105 transition-all duration-200"
                >
                  Claim Your HoloPass Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </WalletConnectModal>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get the latest updates on HoloPass features, events, and exclusive opportunities.
          </p>
          <NewsletterSignup />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Image src="/holopass-logo.png" alt="HoloPass Logo" width={32} height={32} className="rounded-lg" />
                <span className="text-lg font-bold text-foreground">HoloPass</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Creating a borderless digital passport that blends the excitement of collectibles with the practicality
                of universal access.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors bg-transparent"
                >
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-secondary/10 hover:text-secondary hover:border-secondary transition-colors bg-transparent"
                >
                  Discord
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-accent/10 hover:text-accent hover:border-accent transition-colors bg-transparent"
                >
                  GitHub
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="hover:text-foreground transition-colors"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Roadmap
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Partners
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("community")}
                    className="hover:text-foreground transition-colors"
                  >
                    Community
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 HoloPass. All rights reserved. Built on Ethereum with ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
