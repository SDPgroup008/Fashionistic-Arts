"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Eye } from "lucide-react"
import { VideoModal } from "@/components/video-modal"

const videos = [
  {
    id: 1,
    title: "Creating Golden Depths - Time Lapse",
    thumbnail: "/placeholder.svg?height=400&width=600",
    duration: "5:32",
    views: "2.1K",
    description: "Watch the creation of 'Golden Depths' from start to finish in this mesmerizing time-lapse video.",
    medium: "Acrylic",
    surface: "Canvas",
    videoUrl: "https://example.com/video1.mp4",
  },
  {
    id: 2,
    title: "Digital Art Process - Neon Dreams",
    thumbnail: "/placeholder.svg?height=400&width=600",
    duration: "8:15",
    views: "3.5K",
    description: "Explore the digital creation process behind the futuristic artwork 'Neon Dreams'.",
    medium: "Digital",
    surface: "Digital",
    videoUrl: "https://example.com/video2.mp4",
  },
  {
    id: 3,
    title: "Mixed Media Techniques Tutorial",
    thumbnail: "/placeholder.svg?height=400&width=600",
    duration: "12:45",
    views: "5.2K",
    description: "Learn advanced mixed media techniques used in creating contemporary artworks.",
    medium: "Mixed Media",
    surface: "Wood",
    videoUrl: "https://example.com/video3.mp4",
  },
  {
    id: 4,
    title: "Oil Painting Masterclass",
    thumbnail: "/placeholder.svg?height=400&width=600",
    duration: "15:20",
    views: "4.8K",
    description: "A comprehensive masterclass on oil painting techniques and color theory.",
    medium: "Oil",
    surface: "Canvas",
    videoUrl: "https://example.com/video4.mp4",
  },
]

export function VideoGrid() {
  const [selectedVideo, setSelectedVideo] = useState<(typeof videos)[0] | null>(null)

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
