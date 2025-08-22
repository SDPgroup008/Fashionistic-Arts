"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Eye, ShoppingCart } from "lucide-react"

const mockShopItems = [
  {
    id: 1,
    title: "Golden Depths",
    price: 1200,
    available: true,
    featured: true,
    sales: 0,
    views: 245,
    image: "/placeholder.svg?height=150&width=200",
  },
  {
    id: 2,
    title: "Neon Dreams",
    price: 800,
    available: true,
    featured: false,
    sales: 2,
    views: 189,
    image: "/placeholder.svg?height=150&width=200",
  },
  {
    id: 3,
    title: "Crimson Passion",
    price: 1400,
    available: false,
    featured: true,
    sales: 1,
    views: 156,
    image: "/placeholder.svg?height=150&width=200",
  },
]

export function ShopManager() {
  const [shopItems, setShopItems] = useState(mockShopItems)

  const toggleAvailability = (id: number) => {
    setShopItems((prev) => prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item)))
  }

  const toggleFeatured = (id: number) => {
    setShopItems((prev) => prev.map((item) => (item.id === id ? { ...item, featured: !item.featured } : item)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Shop Management</h2>
        <p className="text-muted-foreground">Manage availability and featured status of your artworks in the shop.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {shopItems.map((item) => (
          <Card key={item.id} className="bg-card/50 backdrop-blur-sm border-border/50">
            <div className="relative">
              <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-40 object-cover" />
              {item.featured && (
                <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">Featured</Badge>
              )}
              {!item.available && (
                <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">Sold</Badge>
              )}
            </div>
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="font-serif font-semibold text-lg text-foreground">{item.title}</h3>
                <p className="text-xl font-bold text-primary">UGX {item.price?.toLocaleString()}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Eye size={14} className="text-muted-foreground" />
                  <span>{item.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingCart size={14} className="text-muted-foreground" />
                  <span>{item.sales} sold</span>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`available-${item.id}`} className="text-sm font-medium">
                    Available for Sale
                  </Label>
                  <Switch
                    id={`available-${item.id}`}
                    checked={item.available}
                    onCheckedChange={() => toggleAvailability(item.id)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor={`featured-${item.id}`} className="text-sm font-medium">
                    Featured Item
                  </Label>
                  <Switch
                    id={`featured-${item.id}`}
                    checked={item.featured}
                    onCheckedChange={() => toggleFeatured(item.id)}
                  />
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                View in Shop
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
