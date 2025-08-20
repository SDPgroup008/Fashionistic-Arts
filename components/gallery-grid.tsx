"use client"

import { useState } from "react"
import { ArtworkCard } from "@/components/artwork-card"
import { ArtworkModal } from "@/components/artwork-modal"

// Sample artwork data
const artworks = [
  {
    id: 1,
    title: "Golden Depths",
    image: "/placeholder.svg?height=600&width=400",
    medium: "Acrylic",
    surface: "Canvas",
    size: "24x36 inches",
    description:
      "A mesmerizing exploration of golden hues and abstract forms that evoke the depths of human emotion and the richness of artistic expression.",
    price: 1200,
    year: 2024,
  },
  {
    id: 2,
    title: "Neon Dreams",
    image: "/placeholder.svg?height=800&width=600",
    medium: "Digital",
    surface: "Metal",
    size: "30x40 inches",
    description:
      "A futuristic digital masterpiece that captures the essence of modern urban life through vibrant neon colors and dynamic compositions.",
    price: 800,
    year: 2024,
  },
  {
    id: 3,
    title: "Midnight Elegance",
    image: "/placeholder.svg?height=500&width=700",
    medium: "Mixed Media",
    surface: "Wood",
    size: "18x24 inches",
    description:
      "An elegant composition that plays with light and shadow, creating a sophisticated piece that speaks to the beauty found in darkness.",
    price: 950,
    year: 2023,
  },
  {
    id: 4,
    title: "Crimson Passion",
    image: "/placeholder.svg?height=700&width=500",
    medium: "Oil",
    surface: "Canvas",
    size: "20x30 inches",
    description:
      "A bold expression of passion and intensity, this oil painting captures the raw emotion and energy of the human spirit.",
    price: 1400,
    year: 2024,
  },
  {
    id: 5,
    title: "Serene Waters",
    image: "/placeholder.svg?height=600&width=800",
    medium: "Watercolor",
    surface: "Paper",
    size: "16x20 inches",
    description:
      "A tranquil watercolor piece that invites viewers to find peace and serenity in the gentle flow of water and soft color transitions.",
    price: 650,
    year: 2023,
  },
  {
    id: 6,
    title: "Urban Shadows",
    image: "/placeholder.svg?height=900&width=600",
    medium: "Charcoal",
    surface: "Paper",
    size: "22x28 inches",
    description:
      "A dramatic charcoal drawing that captures the essence of urban life through bold contrasts and expressive line work.",
    price: 750,
    year: 2024,
  },
]

export function GalleryGrid() {
  const [selectedArtwork, setSelectedArtwork] = useState<(typeof artworks)[0] | null>(null)

  return (
    <>
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artworks.map((artwork, index) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                onClick={() => setSelectedArtwork(artwork)}
                className={`animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Artwork Modal */}
      <ArtworkModal artwork={selectedArtwork} isOpen={!!selectedArtwork} onClose={() => setSelectedArtwork(null)} />
    </>
  )
}
