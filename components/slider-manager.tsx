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
  imageUrl: string
  title: string
  artist: string
  medium: string
  order: number
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
      setError("Please fill all fields and select an image")
      return
    }

    if (sliderImages.length >= 5) {
      setError("Maximum 5 slider images allowed")
      return
    }

    setUploading(true)
    setError("")
    setSuccess("")

    try {
      const imageData = {
        title: newImage.title,
        artist: newImage.artist,
        medium: newImage.medium,
        order: sliderImages.length + 1,
      }

      await addSliderImage(imageData, newImage.file)
      setSuccess("Slider image added successfully!")
      setNewImage({ title: "", artist: "Fashionistic Arts", medium: "", file: null })

      // Reset file input
      const fileInput = document.getElementById("slider-file") as HTMLInputElement
      if (fileInput) fileInput.value = ""

      await loadSliderImages()
    } catch (error) {
      setError("Failed to add slider image")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slider image?")) return

    try {
      await deleteSliderImage(id)
      setSuccess("Slider image deleted successfully!")
      await loadSliderImages()
    } catch (error) {
      setError("Failed to delete slider image")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB")
        return
      }
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file")
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
      {/* Add New Slider Image */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus size={20} />
            Add Slider Image
          </CardTitle>
          <p className="text-sm text-muted-foreground">Upload images for the homepage hero slider (Max: 5 images)</p>
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
              <Label htmlFor="slider-file">Image File</Label>
              <Input id="slider-file" type="file" accept="image/*" onChange={handleFileChange} required />
              <p className="text-xs text-muted-foreground">Recommended: 1920x1080px, Max size: 10MB</p>
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

      {/* Current Slider Images */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Slider Images</span>
            <Badge variant="secondary">{sliderImages.length}/5</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sliderImages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No slider images yet. Add your first image above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sliderImages.map((image, index) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={image.imageUrl || "/placeholder.svg"}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteImage(image.id)}
                      className="gap-2"
                    >
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-semibold text-sm">{image.title}</h4>
                    <p className="text-xs text-muted-foreground">by {image.artist}</p>
                    <p className="text-xs text-muted-foreground">{image.medium}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      Position {image.order}
                    </Badge>
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
