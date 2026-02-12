import { EventDiscovery } from "@/components/event-discovery"

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Discover Events</h1>
          <p className="text-muted-foreground">Find Web3 events, meetups, and conferences to attend and earn stamps</p>
        </div>
        <EventDiscovery />
      </div>
    </div>
  )
}
