"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/hooks/use-cart"

interface ProductModalProps {
  product: {
    id: number
    title: string
    image: string
    medium: string
    surface: string
    size: string
    description: string
    price: number
    year: number
    available: boolean
    featured: boolean
  } | null
  isOpen: boolean
  onClose: () => void
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [isLiked, setIsLiked] = useState(false)
  const { addItem } = useCart()

  if (!product) return null

  const handleAddToCart = () => {
    addItem(product)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.title}</DialogTitle>
        </DialogHeader>

        </div> className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Image */}
          <div className="relative">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className={`w-full h-auto rounded-lg shadow-lg ${!product.available ? "grayscale" : ""}`}
            />
            {product.featured && (
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">Featured</Badge>
            )}
            {!product.available && (
              <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">Sold</Badge>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-2">{product.title}</h2>
              <p className="text-lg text-muted-foreground">by Fashionistic Arts • {product.year}</p>
            </div>

            <div className="flex gap-2">
              <Badge variant="secondary">{product.medium}</Badge>
              <Badge variant="outline">{product.surface}</Badge>
              <Badge variant="outline">{product.size}</Badge>
            </div>

            <p className="text-foreground leading-relaxed">{product.description}</p>

            <div className="space-y-4">
              <div className="text-3xl font-bold text-primary">UGX {product.price?.toLocaleString()}</div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.available}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  <ShoppingCart size={16} className="mr-2" />
                  {product.available ? "Add to Cart" : "Sold Out"}
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

            {/* Product Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck size={16} />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield size={16} />
                <span>Authenticity Guaranteed</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RotateCcw size={16} />
                <span>30-Day Returns</span>
              </div>
            </div>

            {/* Artwork Details */}
            <div className="pt-4 border-t border-border space-y-2">
              <h4 className="font-semibold text-foreground">Artwork Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Medium:</span>
                  <span className="ml-2 text-foreground">{product.medium}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Surface:</span>
                  <span className="ml-2 text-foreground">{product.surface}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Size:</span>
                  <span className="ml-2 text-foreground">{product.size}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Year:</span>
                  <span className="ml-2 text-foreground">{product.year}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    d  
  )
}
