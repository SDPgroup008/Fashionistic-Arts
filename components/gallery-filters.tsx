"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"

const mediums = ["All", "Acrylic", "Oil", "Watercolor", "Charcoal", "Digital", "Mixed Media", "Pencil"]
const surfaces = ["All", "Canvas", "Paper", "Wood", "Metal", "Glass", "Fabric"]
const sortOptions = ["Newest", "Oldest", "Title A-Z", "Title Z-A", "Price Low-High", "Price High-Low"]

export function GalleryFilters() {
  const [selectedMedium, setSelectedMedium] = useState("All")
  const [selectedSurface, setSelectedSurface] = useState("All")
  const [sortBy, setSortBy] = useState("Newest")
  const [showFilters, setShowFilters] = useState(false)

  const clearFilters = () => {
    setSelectedMedium("All")
    setSelectedSurface("All")
    setSortBy("Newest")
  }

  const hasActiveFilters = selectedMedium !== "All" || selectedSurface !== "All" || sortBy !== "Newest"

  return (
    <section className="px-4 sm:px-6 lg:px-8 mb-8">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full justify-center gap-2"
          >
            <Filter size={16} />
            Filters & Sort
          </Button>
        </div>

        {/* Filter Controls */}
        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Filter Options */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Medium</label>
                  <Select value={selectedMedium} onValueChange={setSelectedMedium}>
                    <SelectTrigger className="w-full sm:w-40">
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

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Surface</label>
                  <Select value={selectedSurface} onValueChange={setSelectedSurface}>
                    <SelectTrigger className="w-full sm:w-40">
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

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-40">
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

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
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
                {sortBy !== "Newest" && (
                  <Badge variant="secondary" className="gap-1">
                    Sort: {sortBy}
                    <X size={12} className="cursor-pointer" onClick={() => setSortBy("Newest")} />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
