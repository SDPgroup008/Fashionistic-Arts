"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoModalProps {
  video: {
    id: number
    title: string
    thumbnail: string
    duration: string
    views: string
    description: string
    medium: string
    surface: string
    videoUrl: string
  } | null
  isOpen: boolean
  onClose: () => void
}

export function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  if (!video) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader className="sr-only">
          <DialogTitle>{video.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {/* Video Player Placeholder */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-background/20 flex items-center justify-center">
              <div className="bg-primary text-primary-foreground rounded-full p-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Video Details */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">{video.title}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  {video.views} views
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {video.duration}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Badge variant="secondary">{video.medium}</Badge>
              <Badge variant="outline">{video.surface}</Badge>
            </div>

            <p className="text-foreground leading-relaxed">{video.description}</p>

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Share2 size={16} />
                Share
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
