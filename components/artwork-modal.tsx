"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Share2, ShoppingCart } from "lucide-react"
import { useState } from "react"

interface ArtworkModalProps {
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
  } | null
  isOpen: boolean
  onClose: () => void
}

export function ArtworkModal({ artwork, isOpen, onClose }: ArtworkModalProps) {
  const [isLiked, setIsLiked] = useState(false)

  if (!artwork) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader className="sr-only">
          <DialogTitle>{artwork.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Image */}
          <div className="relative">
            <img
              src={artwork.image || "/placeholder.svg"}
              alt={artwork.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-2">{artwork.title}</h2>
              <p className="text-lg text-muted-foreground">by Fashionistic Arts • {artwork.year}</p>
            </div>

            <div className="flex gap-2">
              <Badge variant="secondary">{artwork.medium}</Badge>
              <Badge variant="outline">{artwork.surface}</Badge>
              <Badge variant="outline">{artwork.size}</Badge>
            </div>

            <p className="text-foreground leading-relaxed">{artwork.description}</p>

            <div className="space-y-4">
              <div className="text-3xl font-bold text-primary">UGX {artwork.price?.toLocaleString()}</div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  <ShoppingCart size={16} className="mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsLiked(!isLiked)}
                  className={isLiked ? "text-primary border-primary" : ""}
                >
                  <Heart size={16} className={isLiked ? "fill-current" : ""} />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 size={16} />
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <h4 className="font-semibold text-foreground">Artwork Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Medium:</span>
                  <span className="ml-2 text-foreground">{artwork.medium}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Surface:</span>
                  <span className="ml-2 text-foreground">{artwork.surface}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Size:</span>
                  <span className="ml-2 text-foreground">{artwork.size}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Year:</span>
                  <span className="ml-2 text-foreground">{artwork.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
