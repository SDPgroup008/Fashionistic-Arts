"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { ProductModal } from "@/components/product-modal"
import { getArtworksByCategory } from "@/lib/firebase-service"
import type { Artwork } from "@/lib/firebase-service"

export function ShopGrid() {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [shopItems, setShopItems] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadShopItems = async () => {
      try {
        console.log("[v0] Loading shop items...")
        const items = await getArtworksByCategory("shop")
        console.log("[v0] Loaded shop items:", items.length, items)
        setShopItems(items)
      } catch (error) {
        console.error("Error loading shop items:", error)
      } finally {
        setLoading(false)
      }
    }

    loadShopItems()
  }, [])

  if (loading) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading shop items...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (shopItems.length === 0) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-4">No Shop Items Yet</h3>
            <p className="text-muted-foreground">Shop items will appear here once uploaded with "shop" category.</p>
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
            {shopItems.map((item, index) => (
              <ProductCard
                key={item.id}
                product={{
                  id: Number.parseInt(item.id || "0"),
                  title: item.title,
                  image: item.imageUrl,
                  medium: item.medium,
                  surface: item.material,
                  size: item.size,
                  description: item.description,
                  price: item.price || 0,
                  year: new Date(item.createdAt).getFullYear(),
                  available: item.isForSale,
                  featured: false, // Can be enhanced later with featured field
                }}
                onClick={() =>
                  setSelectedProduct({
                    id: Number.parseInt(item.id || "0"),
                    title: item.title,
                    image: item.imageUrl,
                    medium: item.medium,
                    surface: item.material,
                    size: item.size,
                    description: item.description,
                    price: item.price || 0,
                    year: new Date(item.createdAt).getFullYear(),
                    available: item.isForSale,
                    featured: false,
                  })
                }
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  )
}
