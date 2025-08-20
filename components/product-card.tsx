"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

interface ProductCardProps {
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
  }
  onClick: () => void
  className?: string
  style?: React.CSSProperties
}

export function ProductCard({ product, onClick, className, style }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(product)
  }

  return (
    <Card
      className={`group cursor-pointer overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 bg-card/50 backdrop-blur-sm ${className}`}
      style={style}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        {product.featured && (
          <Badge className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground">Featured</Badge>
        )}
        {!product.available && (
          <Badge className="absolute top-2 right-2 z-10 bg-destructive text-destructive-foreground">Sold</Badge>
        )}

        <img
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          className={`w-full h-64 object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          } ${!product.available ? "grayscale" : ""}`}
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
                  {product.medium}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {product.surface}
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
          {product.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>{product.size}</span>
          <span className="text-lg font-bold text-primary">${product.price}</span>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={!product.available}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.available ? (
            <>
              <ShoppingCart size={16} className="mr-2" />
              Add to Cart
            </>
          ) : (
            "Sold Out"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
