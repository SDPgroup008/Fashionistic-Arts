"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Trash2, Upload, Plus, X } from "lucide-react"
import { getVideosFromCollection, addVideoToCollection, deleteFile } from "@/lib/firebase-service"
import { deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface VideoData {
  id: string
  title: string
  artist: string
  medium: string
  videoUrl: string
  fileType: "video"
  order: number
  createdAt: Date
  updatedAt: Date
}

export function VideoManager() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [newVideo, setNewVideo] = useState({
    title: "",
    artist: "Fashionistic Arts",
    medium: "",
    description: "",
    file: null as File | null,
  })

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      console.log("[v0] Loading videos from /Fashionistic_Arts/videos collection...")
      const videoData = await getVideosFromCollection()
      setVideos(videoData as VideoData[])
      console.log("[v0] Loaded videos:", videoData.length)
    } catch (error) {
      console.error("[v0] Error loading videos:", error)
      setError("Failed to load videos")
    } finally {
      setLoading(false)
    }
  }

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newVideo.file || !newVideo.title || !newVideo.medium) {
      setError("Please fill all fields and select a video file")
      return
    }

    if (!newVideo.file.type.startsWith("video/")) {
      setError("Please select a video file")
      return
    }

    if (newVideo.file.size > 100 * 1024 * 1024) {
      setError("Video file size must be less than 100MB")
      return
    }

    setUploading(true)
    setError("")
    setSuccess("")

    try {
      console.log("[v0] Adding video to /Fashionistic_Arts/videos collection...")

      const videoData = {
        title: newVideo.title,
        artist: newVideo.artist,
        medium: newVideo.medium,
        fileType: "video" as const,
        order: videos.length + 1,
      }

      await addVideoToCollection(videoData, newVideo.file)
      setSuccess("Video uploaded successfully!")
      setNewVideo({ title: "", artist: "Fashionistic Arts", medium: "", description: "", file: null })

      // Reset file input
      const fileInput = document.getElementById("video-file") as HTMLInputElement
      if (fileInput) fileInput.value = ""

      setShowUploadForm(false)
      await loadVideos()
    } catch (error) {
      console.error("[v0] Error adding video:", error)
      setError("Failed to upload video")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteVideo = async (video: VideoData) => {
    if (!confirm("Are you sure you want to delete this video?")) return

    try {
      setLoading(true)
      console.log("[v0] Deleting video:", video.id)

      // Delete the video file from storage
      if (video.videoUrl) {
        try {
          await deleteFile(video.videoUrl)
        } catch (error) {
          console.warn("Failed to delete video file from storage:", error)
        }
      }

      // Delete the document from Firestore
      await deleteDoc(doc(db, "Fashionistic_Arts_Videos", video.id))

      setSuccess("Video deleted successfully!")
      await loadVideos()
    } catch (error) {
      console.error("[v0] Error deleting video:", error)
      setError("Failed to delete video")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("video/")) {
        setError("Please select a video file")
        return
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Video file size must be less than 100MB")
        return
      }
      setNewVideo((prev) => ({ ...prev, file }))
      setError("")
    }
  }

  const resetForm = () => {
    setNewVideo({ title: "", artist: "Fashionistic Arts", medium: "", description: "", file: null })
    setShowUploadForm(false)
    setError("")
    setSuccess("")
  }

  if (loading && videos.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">Loading videos...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {!showUploadForm && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground">Video Collection</h2>
            <p className="text-muted-foreground">
              Manage videos for the website video section ({videos.length} videos)
            </p>
          </div>
          <Button
            onClick={() => setShowUploadForm(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={16} className="mr-2" />
            Add Video
          </Button>
        </div>
      )}

      {/* Upload Form */}
      {showUploadForm && (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Plus size={20} />
                Upload New Video
              </span>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X size={16} />
              </Button>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Upload videos to display in the website video section</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddVideo} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="video-title">Title</Label>
                  <Input
                    id="video-title"
                    value={newVideo.title}
                    onChange={(e) => setNewVideo((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter video title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video-artist">Artist</Label>
                  <Input
                    id="video-artist"
                    value={newVideo.artist}
                    onChange={(e) => setNewVideo((prev) => ({ ...prev, artist: e.target.value }))}
                    placeholder="Artist name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-medium">Medium/Category</Label>
                <Input
                  id="video-medium"
                  value={newVideo.medium}
                  onChange={(e) => setNewVideo((prev) => ({ ...prev, medium: e.target.value }))}
                  placeholder="e.g., Digital Art, Animation, Performance"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-description">Description (Optional)</Label>
                <Textarea
                  id="video-description"
                  value={newVideo.description}
                  onChange={(e) => setNewVideo((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the video"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-file">Video File</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {newVideo.file ? newVideo.file.name : "Click to upload or drag and drop your video"}
                  </p>
                  <Input
                    id="video-file"
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2 bg-transparent"
                    onClick={() => document.getElementById("video-file")?.click()}
                  >
                    Choose Video File
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Supported formats: MP4, WebM, MOV. Max size: 100MB</p>
              </div>

              {error && (
                <Alert className="border-destructive/50 text-destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-500/50 text-green-400">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={uploading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={16} className="mr-2" />
                      Upload Video
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} disabled={uploading}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Success/Error Messages */}
      {!showUploadForm && success && (
        <Alert className="border-green-500/50 text-green-400">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {!showUploadForm && error && (
        <Alert className="border-destructive/50 text-destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Video Grid */}
      {!showUploadForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No videos uploaded yet. Add your first video above.</p>
            </div>
          ) : (
            videos.map((video) => (
              <Card key={video.id} className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
                <div className="relative">
                  <video
                    src={video.videoUrl}
                    className="w-full h-48 object-cover"
                    controls={false}
                    muted
                    preload="metadata"
                  />
                  <Badge className="absolute top-2 left-2" variant="secondary">
                    Video
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-serif font-semibold text-lg text-foreground mb-2">{video.title}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground mb-3">
                    <p>by {video.artist}</p>
                    <p>{video.medium}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteVideo(video)}
                      className="text-destructive hover:text-destructive flex-1"
                      disabled={loading}
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
