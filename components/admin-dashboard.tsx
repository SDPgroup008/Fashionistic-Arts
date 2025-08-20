"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LogOut, ImageIcon, Video, ShoppingCart, BarChart3, Home, FileSlidersIcon as Slideshow } from "lucide-react"
import { ArtworkManager } from "@/components/artwork-manager"
import { ShopManager } from "@/components/shop-manager"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { SliderManager } from "@/components/"

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [totalArtworks] = useState(12) // Mock data
  const [totalSales] = useState(8)
  const [totalRevenue] = useState(9850)
  const [uploadLimit] = useState(15)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-serif font-bold">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Admin Dashboard
                </span>
              </h1>
              <p className="text-sm text-muted-foreground">Manage your art gallery</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Home size={16} />
                  Home
                </Button>
              </Link>
              <Button variant="outline" onClick={onLogout} className="gap-2 bg-transparent">
                <LogOut size={16} />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Artworks</CardTitle>
              <ImageIcon size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {totalArtworks}/{uploadLimit}
              </div>
              <p className="text-xs text-muted-foreground">{uploadLimit - totalArtworks} slots remaining</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <ShoppingCart size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalSales}</div>
              <p className="text-xs text-muted-foreground">Artworks sold</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <BarChart3 size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${totalRevenue}</div>
              <p className="text-xs text-muted-foreground">Total earnings</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upload Status</CardTitle>
              <Video size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={totalArtworks >= uploadLimit ? "destructive" : "secondary"}>
                  {totalArtworks >= uploadLimit ? "Limit Reached" : "Available"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalArtworks >= uploadLimit ? "Delete items to upload more" : "Ready for uploads"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="artworks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="artworks" className="gap-2">
              <ImageIcon size={16} />
              Artworks
            </TabsTrigger>
            <TabsTrigger value="slider" className="gap-2">
              <Slideshow size={16} />
              Slider
            </TabsTrigger>
            <TabsTrigger value="shop" className="gap-2">
              <ShoppingCart size={16} />
              Shop
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 size={16} />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="artworks">
            <ArtworkManager uploadLimit={uploadLimit} currentCount={totalArtworks} />
          </TabsContent>

          <TabsContent value="slider">
            <SliderManager />
          </TabsContent>

          <TabsContent value="shop">
            <ShopManager />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
