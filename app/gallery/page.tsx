import { Navigation } from "@/components/navigation"
import { GalleryGrid } from "@/components/gallery-grid"
import { GalleryFilters } from "@/components/gallery-filters"
import { Footer } from "@/components/footer"

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
        {/* Gallery Header */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Gallery</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore our curated collection of contemporary artworks, each piece crafted with passion and artistic
              vision.
            </p>
          </div>
        </section>

        {/* Filters */}
        <GalleryFilters />

        {/* Gallery Grid */}
        <GalleryGrid />
      </div>
      <Footer />
    </main>
  )
}
