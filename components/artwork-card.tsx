"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart } from "lucide-react"

interface ArtworkCardProps {
  artwork: {
    id: number
    title: string
    image: string
    medium: string
    surface: string
    size: string
    description: string
    price: number
    year: number
  }
  onClick: () => void
  className?: string
  style?: React.CSSProperties
}

export function ArtworkCard({ artwork, onClick, className, style }: ArtworkCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  return (
    <Card
      className={`group cursor-pointer overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 bg-card/50 backdrop-blur-sm ${className}`}
      style={style}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img
          src={artwork.image || "/placeholder.svg"}
          alt={artwork.title}
          className={`w-full h-64 object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  {artwork.medium}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {artwork.surface}
                </Badge>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsLiked(!isLiked)
                  }}
                  className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                    isLiked
                      ? "bg-primary text-primary-foreground"
                      : "bg-background/50 text-foreground hover:bg-background/70"
                  }`}
                >
                  <Heart size={16} className={isLiked ? "fill-current" : ""} />
                </button>
                <div className="p-2 rounded-full bg-background/50 backdrop-blur-sm text-foreground">
                  <Eye size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-serif font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
          {artwork.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{artwork.description}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{artwork.size}</span>
          <span className="font-semibold text-primary">${artwork.price}</span>
        </div>
      </CardContent>
    </Card>
  )
}
