"use client"

import { useState, useEffect } from "react"
import { ArtworkCard } from "@/components/artwork-card"
import { ArtworkModal } from "@/components/artwork-modal"
import { getArtworksByCategory } from "@/lib/firebase-service"
import type { Artwork } from "@/lib/firebase-service"

export function GalleryGrid() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        console.log("[v0] Loading gallery artworks...")
        const galleryArtworks = await getArtworksByCategory("gallery")
        console.log("[v0] Loaded gallery artworks:", galleryArtworks.length, galleryArtworks)
        setArtworks(galleryArtworks)
        setFilteredArtworks(galleryArtworks)
      } catch (error) {
        console.error("Error loading gallery artworks:", error)
      } finally {
        setLoading(false)
      }
    }

    loadArtworks()
  }, [])

  const handleFiltersChange = (filters: { medium: string; surface: string; sortBy: string }) => {
    let filtered = [...artworks]

    // Apply medium filter
    if (filters.medium !== "All") {
      filtered = filtered.filter((artwork) => artwork.medium?.toLowerCase() === filters.medium.toLowerCase())
    }

    // Apply surface filter
    if (filters.surface !== "All") {
      filtered = filtered.filter((artwork) => artwork.material?.toLowerCase() === filters.surface.toLowerCase())
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "Newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "Oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "Title A-Z":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "Title Z-A":
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
      case "Price Low-High":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case "Price High-Low":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      default:
        // Default to newest
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    setFilteredArtworks(filtered)
  }

  useEffect(() => {
    // Make the filter function available to the parent GalleryFilters component
    window.galleryFiltersHandler = handleFiltersChange
  }, [artworks])

  if (loading) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading gallery...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (artworks.length === 0) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-4">No Artworks Yet</h3>
            <p className="text-muted-foreground">Gallery artworks will appear here once uploaded.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtworks.map((artwork, index) => (
              <ArtworkCard
                key={artwork.id}
                artwork={{
                  id: Number.parseInt(artwork.id || "0"),
                  title: artwork.title,
                  image: artwork.imageUrl,
                  medium: artwork.medium,
                  surface: artwork.material,
                  size: artwork.size,
                  description: artwork.description,
                  price: artwork.price || 0,
                  year: new Date(artwork.createdAt).getFullYear(),
                }}
                onClick={() => setSelectedArtwork(artwork)}
                className={`animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>

          {filteredArtworks.length === 0 && artworks.length > 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-serif font-bold text-foreground mb-4">No Results Found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to see more artworks.</p>
            </div>
          )}
        </div>
      </section>

      {/* Artwork Modal */}
      {selectedArtwork && (
        <ArtworkModal
          artwork={{
            id: Number.parseInt(selectedArtwork.id || "0"),
            title: selectedArtwork.title,
            image: selectedArtwork.imageUrl,
            medium: selectedArtwork.medium,
            surface: selectedArtwork.material,
            size: selectedArtwork.size,
            description: selectedArtwork.description,
            price: selectedArtwork.price || 0,
            year: new Date(selectedArtwork.createdAt).getFullYear(),
          }}
          isOpen={!!selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </>
  )
}
