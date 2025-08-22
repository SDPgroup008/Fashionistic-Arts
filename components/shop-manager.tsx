"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Trash2, Upload, Plus } from "lucide-react"
import { getSliderImages, addSliderImage, deleteSliderImage } from "@/lib/firebase-service"

interface SliderImage {
  id: string
  imageUrl?: string
  videoUrl?: string
  title: string
  artist: string
  medium: string
  fileType: "image" | "video"
  order: number
  createdAt: Date
  updatedAt: Date
}

export function SliderManager() {
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [newImage, setNewImage] = useState({
    title: "",
    artist: "Fashionistic Arts",
    medium: "",
    file: null as File | null,
  })

  useEffect(() => {
    loadSliderImages()
  }, [])

  const loadSliderImages = async () => {
    try {
      const images = await getSliderImages()
      setSliderImages(images)
    } catch (error) {
      setError("Failed to load slider images")
    } finally {
      setLoading(false)
    }
  }

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newImage.file || !newImage.title || !newImage.medium) {
      setError("Please fill all fields and select a file")
      return
    }

    if (sliderImages.length >= 5) {
      setError("Maximum 5 slider items allowed")
      return
    }

    setUploading(true)
    setError("")
    setSuccess("")

    try {
      const fileType = newImage.file.type.startsWith("image/") ? "image" : "video"

      const sliderData = {
        title: newImage.title,
        artist: newImage.artist,
        medium: newImage.medium,
        fileType: fileType as "image" | "video",
        order: sliderImages.length + 1,
      }

      await addSliderImage(sliderData, newImage.file)
      setSuccess(`Slider ${fileType} added successfully!`)
      setNewImage({ title: "", artist: "Fashionistic Arts", medium: "", file: null })

      // Reset file input
      const fileInput = document.getElementById("slider-file") as HTMLInputElement
      if (fileInput) fileInput.value = ""

      await loadSliderImages()
    } catch (error) {
      console.error("Error adding slider item:", error)
      setError("Failed to add slider item")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slider item?")) return

    try {
      await deleteSliderImage(id)
      setSuccess("Slider item deleted successfully!")
      await loadSliderImages()
    } catch (error) {
      setError("Failed to delete slider item")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError("File size must be less than 50MB")
        return
      }
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        setError("Please select an image or video file")
        return
      }
      setNewImage((prev) => ({ ...prev, file }))
      setError("")
    }
  }

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add New Slider Item */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus size={20} />
            Add Slider Item
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload images or videos for the homepage hero slider (Max: 5 items)
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddImage} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slider-title">Title</Label>
                <Input
                  id="slider-title"
                  value={newImage.title}
                  onChange={(e) => setNewImage((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter artwork title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slider-artist">Artist</Label>
                <Input
                  id="slider-artist"
                  value={newImage.artist}
                  onChange={(e) => setNewImage((prev) => ({ ...prev, artist: e.target.value }))}
                  placeholder="Artist name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slider-medium">Medium</Label>
              <Input
                id="slider-medium"
                value={newImage.medium}
                onChange={(e) => setNewImage((prev) => ({ ...prev, medium: e.target.value }))}
                placeholder="e.g., Acrylic on Canvas, Digital Art"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slider-file">Image or Video File</Label>
              <Input id="slider-file" type="file" accept="image/*,video/*" onChange={handleFileChange} required />
              <p className="text-xs text-muted-foreground">Recommended: 1920x1080px for images, Max size: 50MB</p>
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

            <Button type="submit" disabled={uploading || sliderImages.length >= 5} className="w-full">
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Add to Slider
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Current Slider Items */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Slider Items</span>
            <Badge variant="secondary">{sliderImages.length}/5</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sliderImages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No slider items yet. Add your first item above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sliderImages.map((item, index) => (
                <div key={item.id} className="relative group">
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    {item.fileType === "video" ? (
                      <video src={item.videoUrl} className="w-full h-full object-cover" controls muted />
                    ) : (
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteImage(item.id)}
                      className="gap-2"
                    >
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">by {item.artist}</p>
                    <p className="text-xs text-muted-foreground">{item.medium}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Position {item.order}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {item.fileType}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
