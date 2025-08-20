"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { X, Filter, ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

const mediums = ["All", "Acrylic", "Oil", "Watercolor", "Charcoal", "Digital", "Mixed Media", "Pencil"]
const surfaces = ["All", "Canvas", "Paper", "Wood", "Metal", "Glass", "Fabric"]
const sortOptions = ["Featured", "Price Low-High", "Price High-Low", "Newest", "Title A-Z"]

export function ShopFilters() {
  const [selectedMedium, setSelectedMedium] = useState("All")
  const [selectedSurface, setSelectedSurface] = useState("All")
  const [sortBy, setSortBy] = useState("Featured")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [showFilters, setShowFilters] = useState(false)
  const { items, toggleCart } = useCart()

  const clearFilters = () => {
    setSelectedMedium("All")
    setSelectedSurface("All")
    setSortBy("Featured")
    setPriceRange([0, 2000])
  }

  const hasActiveFilters =
    selectedMedium !== "All" ||
    selectedSurface !== "All" ||
    sortBy !== "Featured" ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 2000

  return (
    <section className="px-4 sm:px-6 lg:px-8 mb-8">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Filter Toggle & Cart */}
        <div className="lg:hidden mb-4 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1 justify-center gap-2"
          >
            <Filter size={16} />
            Filters & Sort
          </Button>
          <Button variant="outline" onClick={toggleCart} className="gap-2 relative bg-transparent">
            <ShoppingCart size={16} />
            {items.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {items.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Desktop Cart Button */}
        <div className="hidden lg:flex justify-end mb-4">
          <Button variant="outline" onClick={toggleCart} className="gap-2 relative bg-transparent">
            <ShoppingCart size={16} />
            Cart ({items.length})
            {items.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {items.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filter Controls */}
        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Medium Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Medium</label>
                <Select value={selectedMedium} onValueChange={setSelectedMedium}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mediums.map((medium) => (
                      <SelectItem key={medium} value={medium}>
                        {medium}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Surface Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Surface</label>
                <Select value={selectedSurface} onValueChange={setSelectedSurface}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {surfaces.map((surface) => (
                      <SelectItem key={surface} value={surface}>
                        {surface}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={2000}
                  min={0}
                  step={50}
                  className="w-full"
                />
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters & Active Filters */}
            {hasActiveFilters && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-foreground">Active Filters</h4>
                  <Button variant="ghost" onClick={clearFilters} className="gap-2 text-muted-foreground">
                    <X size={16} />
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedMedium !== "All" && (
                    <Badge variant="secondary" className="gap-1">
                      Medium: {selectedMedium}
                      <X size={12} className="cursor-pointer" onClick={() => setSelectedMedium("All")} />
                    </Badge>
                  )}
                  {selectedSurface !== "All" && (
                    <Badge variant="secondary" className="gap-1">
                      Surface: {selectedSurface}
                      <X size={12} className="cursor-pointer" onClick={() => setSelectedSurface("All")} />
                    </Badge>
                  )}
                  {(priceRange[0] !== 0 || priceRange[1] !== 2000) && (
                    <Badge variant="secondary" className="gap-1">
                      ${priceRange[0]} - ${priceRange[1]}
                      <X size={12} className="cursor-pointer" onClick={() => setPriceRange([0, 2000])} />
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
