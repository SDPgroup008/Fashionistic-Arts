"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"

const heroArtworks = [
  {
    id: 1,
    image: "/placeholder.svg?height=1080&width=1920",
    title: "Golden Depths",
    artist: "Fashionistic Arts",
    medium: "Acrylic on Canvas",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=1080&width=1920",
    title: "Neon Dreams",
    artist: "Fashionistic Arts",
    medium: "Digital Art",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=1080&width=1920",
    title: "Midnight Elegance",
    artist: "Fashionistic Arts",
    medium: "Mixed Media",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroArtworks.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroArtworks.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroArtworks.length) % heroArtworks.length)
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0">
        {heroArtworks.map((artwork, index) => (
          <div
            key={artwork.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center parallax"
              style={{
                backgroundImage: `url(${artwork.image})`,
                transform: `translateY(${index === currentSlide ? 0 : 20}px)`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-foreground mb-6 leading-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Fashionistic Arts
                </span>
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-8 font-light">
                Where Creativity Meets Vision
              </p>
              <p className="text-lg text-muted-foreground mb-12 max-w-2xl leading-relaxed">
                Discover a curated collection of contemporary artworks that blend traditional techniques with modern
                innovation. Each piece tells a story of artistic excellence and creative vision.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-4 text-lg rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
              >
                Explore Gallery
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-semibold px-8 py-4 text-lg rounded-lg transition-all duration-300 hover:scale-105 bg-transparent"
              >
                Shop Art
              </Button>
            </div>

            {/* Current Artwork Info */}
            <div className="mt-16 animate-fade-in">
              <div className="bg-card/20 backdrop-blur-sm border border-border/30 rounded-lg p-6 max-w-md">
                <h3 className="text-xl font-semibold text-foreground mb-2">{heroArtworks[currentSlide].title}</h3>
                <p className="text-muted-foreground mb-1">by {heroArtworks[currentSlide].artist}</p>
                <p className="text-sm text-muted-foreground">{heroArtworks[currentSlide].medium}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="bg-background/20 backdrop-blur-sm hover:bg-background/40 text-foreground border border-border/30"
        >
          <ChevronLeft size={20} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="bg-background/20 backdrop-blur-sm hover:bg-background/40 text-foreground border border-border/30"
        >
          <Play size={16} className={isAutoPlaying ? "opacity-50" : "opacity-100"} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="bg-background/20 backdrop-blur-sm hover:bg-background/40 text-foreground border border-border/30"
        >
          <ChevronRight size={20} />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {heroArtworks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-primary scale-125" : "bg-foreground/30 hover:bg-foreground/50"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
