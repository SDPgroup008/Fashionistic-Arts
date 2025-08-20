"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Eye, ShoppingCart, DollarSign, Users } from "lucide-react"

const mockAnalytics = {
  totalViews: 12450,
  totalSales: 8,
  totalRevenue: 9850,
  conversionRate: 2.4,
  topArtworks: [
    { title: "Golden Depths", views: 245, sales: 0, revenue: 0 },
    { title: "Neon Dreams", views: 189, sales: 2, revenue: 1600 },
    { title: "Crimson Passion", views: 156, sales: 1, revenue: 1400 },
  ],
  recentActivity: [
    { type: "sale", item: "Neon Dreams", amount: 800, time: "2 hours ago" },
    { type: "view", item: "Golden Depths", time: "5 hours ago" },
    { type: "sale", item: "Crimson Passion", amount: 1400, time: "1 day ago" },
  ],
}

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Analytics Overview</h2>
        <p className="text-muted-foreground">Track your gallery's performance and sales metrics.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockAnalytics.totalViews.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-green-500">
              <TrendingUp size={12} />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockAnalytics.totalSales}</div>
            <div className="flex items-center gap-1 text-xs text-green-500">
              <TrendingUp size={12} />
              +3 from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${mockAnalytics.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-green-500">
              <TrendingUp size={12} />
              +28% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Users size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockAnalytics.conversionRate}%</div>
            <div className="flex items-center gap-1 text-xs text-red-500">
              <TrendingDown size={12} />
              -0.3% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Artworks */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Top Performing Artworks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.topArtworks.map((artwork, index) => (
                <div key={artwork.title} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium text-foreground">{artwork.title}</p>
                      <p className="text-sm text-muted-foreground">{artwork.views} views</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">${artwork.revenue}</p>
                    <p className="text-sm text-muted-foreground">{artwork.sales} sales</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === "sale" ? "bg-green-500/20 text-green-500" : "bg-blue-500/20 text-blue-500"
                    }`}
                  >
                    {activity.type === "sale" ? <DollarSign size={14} /> : <Eye size={14} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {activity.type === "sale" ? "Sale" : "View"}: {activity.item}
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                  {activity.amount && <p className="font-semibold text-primary">${activity.amount}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
