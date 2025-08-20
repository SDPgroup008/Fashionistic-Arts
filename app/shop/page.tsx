import { Navigation } from "@/components/navigation"
import { ShopGrid } from "@/components/shop-grid"
import { ShopFilters } from "@/components/shop-filters"
import { Footer } from "@/components/footer"

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
        {/* Shop Header */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Art Shop</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Own a piece of contemporary art. Each artwork is carefully crafted and available for purchase to
              collectors and art enthusiasts worldwide.
            </p>
          </div>
        </section>

        {/* Shop Filters */}
        <ShopFilters />

        {/* Shop Grid */}
        <ShopGrid />
      </div>
      <Footer />
    </main>
  )
}
