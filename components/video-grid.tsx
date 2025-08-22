"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Eye } from "lucide-react"
import { VideoModal } from "@/components/video-modal"
import { getArtworks } from "@/lib/firebase-service"

export function VideoGrid() {
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const allArtworks = await getArtworks()
        // Filter artworks that have video URLs
        const videoArtworks = allArtworks.filter((artwork) => artwork.videoUrl)

        // Transform to video format expected by VideoModal
        const transformedVideos = videoArtworks.map((artwork, index) => ({
          id: Number.parseInt(artwork.id || "0"),
          title: artwork.title,
          thumbnail: artwork.imageUrl, // Use image as thumbnail
          duration: "N/A", // Duration not stored in current schema
          views: "N/A", // Views not tracked in current schema
          description: artwork.description,
          medium: artwork.medium,
          surface: artwork.material,
          videoUrl: artwork.videoUrl,
        }))

        setVideos(transformedVideos)
      } catch (error) {
        console.error("Error loading videos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [])

  if (loading) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading videos...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (videos.length === 0) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-4">No Videos Yet</h3>
            <p className="text-muted-foreground">
              Video content will appear here once uploaded through the admin dashboard.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <Card
                key={video.id}
                className="group cursor-pointer overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 bg-card/50 backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-background/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-primary text-primary-foreground rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Play size={24} className="ml-1" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 rounded text-xs font-medium">
                    {video.duration}
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-serif font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{video.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {video.medium}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye size={12} />
                      {video.views}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal video={selectedVideo} isOpen={!!selectedVideo} onClose={() => setSelectedVideo(null)} />
    </>
  )
}
