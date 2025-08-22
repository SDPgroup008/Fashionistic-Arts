"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Upload, Edit, Trash2, Save, X, Loader2 } from "lucide-react"
import {
  getArtworks,
  addArtwork,
  updateArtwork,
  deleteArtwork,
  uploadFile,
  deleteFile,
  type Artwork,
} from "@/lib/firebase-service"

interface ArtworkManagerProps {
  uploadLimit: number
  currentCount: number
}

export function ArtworkManager({ uploadLimit, currentCount }: ArtworkManagerProps) {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [formData, setFormData] = useState({
    title: "",
    medium: "",
    material: "",
    size: "",
    price: "",
    description: "",
    category: "gallery" as "gallery" | "shop",
    isForSale: false,
  })

  useEffect(() => {
    loadArtworks()
  }, [])

  const loadArtworks = async () => {
    try {
      setLoading(true)
      const fetchedArtworks = await getArtworks()
      setArtworks(fetchedArtworks)
    } catch (error) {
      console.error("Error loading artworks:", error)
    } finally {
      setLoading(false)
    }
  }

  const canUpload = artworks.length < uploadLimit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedFiles.length === 0 && !editingId) {
      alert("Please select files to upload")
      return
    }

    if (!editingId && artworks.length + selectedFiles.length > uploadLimit) {
      alert(`Cannot upload ${selectedFiles.length} files. This would exceed the limit of ${uploadLimit} artworks.`)
      return
    }

    setUploading(true)
    setUploadProgress({})

    try {
      if (editingId) {
        let imageUrl = ""
        let videoUrl = ""

        if (selectedFiles.length > 0) {
          const file = selectedFiles[0]
          const fileType = file.type.startsWith("image/") ? "images" : "videos"
          const fileName = `${Date.now()}-${file.name}`
          const uploadedUrl = await uploadFile(file, `${fileType}/${fileName}`)

          if (fileType === "images") {
            imageUrl = uploadedUrl
          } else {
            videoUrl = uploadedUrl
          }
        }

        const artworkData: any = {
          title: formData.title,
          description: formData.description,
          size: formData.size,
          material: formData.material,
          medium: formData.medium,
          imageUrl: imageUrl || artworks.find((a) => a.id === editingId)?.imageUrl || "",
          isForSale: formData.isForSale,
          category: formData.category,
        }

        // Only include price if it has a value
        if (formData.price && Number(formData.price) > 0) {
          artworkData.price = Number(formData.price)
        }

        // Only include videoUrl if it has a value
        const existingVideoUrl = artworks.find((a) => a.id === editingId)?.videoUrl
        if (videoUrl || existingVideoUrl) {
          artworkData.videoUrl = videoUrl || existingVideoUrl
        }

        await updateArtwork(editingId, artworkData)
      } else {
        const uploadPromises = selectedFiles.map(async (file, index) => {
          const fileType = file.type.startsWith("image/") ? "images" : "videos"
          const fileName = `${Date.now()}-${index}-${file.name}`

          setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))

          const uploadedUrl = await uploadFile(file, fileType)

          setUploadProgress((prev) => ({ ...prev, [file.name]: 50 }))

          const artworkData: any = {
            title: formData.title || `Artwork ${index + 1}`,
            description: formData.description || `Uploaded artwork ${index + 1}`,
            size: formData.size || "Unknown",
            material: formData.material || "Unknown",
            medium: formData.medium || "Unknown",
            imageUrl: fileType === "images" ? uploadedUrl : "",
            isForSale: formData.isForSale,
            category: formData.category,
          }

          // Only include price if it has a value
          if (formData.price && Number(formData.price) > 0) {
            artworkData.price = Number(formData.price)
          }

          // Only include videoUrl if it's a video file
          if (fileType === "videos") {
            artworkData.videoUrl = uploadedUrl
          }

          await addArtwork(artworkData)
          setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }))
        })

        await Promise.all(uploadPromises)
      }

      await loadArtworks()
      resetForm()
    } catch (error) {
      console.error("Error saving artwork:", error)
      alert("Error saving artwork. Please try again.")
    } finally {
      setUploading(false)
      setUploadProgress({})
    }
  }

  const handleEdit = (artwork: Artwork) => {
    setFormData({
      title: artwork.title,
      medium: artwork.medium,
      material: artwork.material,
      size: artwork.size,
      price: artwork.price?.toString() || "",
      description: artwork.description,
      category: artwork.category,
      isForSale: artwork.isForSale,
    })
    setEditingId(artwork.id || null)
    setShowUploadForm(true)
  }

  const handleDelete = async (artwork: Artwork) => {
    if (!artwork.id) return

    try {
      setLoading(true)
      if (artwork.imageUrl) {
        await deleteFile(artwork.imageUrl)
      }
      if (artwork.videoUrl) {
        await deleteFile(artwork.videoUrl)
      }
      await deleteArtwork(artwork.id)
      await loadArtworks()
    } catch (error) {
      console.error("Error deleting artwork:", error)
      alert("Error deleting artwork. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      medium: "",
      material: "",
      size: "",
      price: "",
      description: "",
      category: "gallery",
      isForSale: false,
    })
    setEditingId(null)
    setSelectedFiles([])
    setUploadProgress({})
    setShowUploadForm(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) return

    if (!editingId && artworks.length + files.length > uploadLimit) {
      alert(`Cannot select ${files.length} files. This would exceed the limit of ${uploadLimit} artworks.`)
      return
    }

    if (files.length > 15) {
      alert("You can upload a maximum of 15 files at once.")
      return
    }

    setSelectedFiles(files)
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  if (loading && artworks.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading artworks...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showUploadForm ? (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingId ? "Edit Artwork" : "Upload New Artwork"}
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X size={16} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title {!editingId && selectedFiles.length > 1 && "(Will be auto-numbered)"}
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={!editingId && selectedFiles.length > 1 ? "Base title for artworks" : "Artwork title"}
                    required={Boolean(editingId || selectedFiles.length <= 1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: "gallery" | "shop") => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gallery">Gallery</SelectItem>
                      <SelectItem value="shop">Shop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medium">Medium</Label>
                  <Select
                    value={formData.medium}
                    onValueChange={(value) => setFormData({ ...formData, medium: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select medium" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Acrylic">Acrylic</SelectItem>
                      <SelectItem value="Oil">Oil</SelectItem>
                      <SelectItem value="Watercolor">Watercolor</SelectItem>
                      <SelectItem value="Charcoal">Charcoal</SelectItem>
                      <SelectItem value="Digital">Digital</SelectItem>
                      <SelectItem value="Mixed Media">Mixed Media</SelectItem>
                      <SelectItem value="Pencil">Pencil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material">Surface Material</Label>
                  <Select
                    value={formData.material}
                    onValueChange={(value) => setFormData({ ...formData, material: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Canvas">Canvas</SelectItem>
                      <SelectItem value="Paper">Paper</SelectItem>
                      <SelectItem value="Wood">Wood</SelectItem>
                      <SelectItem value="Metal">Metal</SelectItem>
                      <SelectItem value="Glass">Glass</SelectItem>
                      <SelectItem value="Fabric">Fabric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    placeholder="e.g., 24x36 inches"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    required={Boolean(editingId || selectedFiles.length <= 1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (UGX) - Optional</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isForSale"
                  checked={formData.isForSale}
                  onChange={(e) => setFormData({ ...formData, isForSale: e.target.checked })}
                />
                <Label htmlFor="isForSale">Available for sale</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description {!editingId && selectedFiles.length > 1 && "(Applied to all)"}
                </Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required={Boolean(editingId || selectedFiles.length <= 1)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Upload Files {!editingId && "(Required)"} - Max 15 files</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {selectedFiles.length > 0
                      ? `${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""} selected`
                      : "Click to upload or drag and drop your images/videos (Max 15 files)"}
                  </p>
                  <Input
                    id="file"
                    type="file"
                    className="hidden"
                    accept="image/*,video/*"
                    multiple={!editingId}
                    onChange={handleFileSelect}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2 bg-transparent"
                    onClick={() => document.getElementById("file")?.click()}
                  >
                    Choose Files
                  </Button>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>Selected Files:</Label>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded text-sm">
                          <span className="truncate flex-1">{file.name}</span>
                          <div className="flex items-center gap-2">
                            {uploadProgress[file.name] !== undefined && (
                              <div className="text-xs text-muted-foreground">{uploadProgress[file.name]}%</div>
                            )}
                            {!uploading && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="h-6 w-6 p-0"
                              >
                                <X size={12} />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={uploading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      {editingId
                        ? "Updating..."
                        : `Uploading ${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""}...`}
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      {editingId ? "Update" : "Upload"} Artwork{selectedFiles.length > 1 ? "s" : ""}
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
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground">Artwork Collection</h2>
            <p className="text-muted-foreground">
              {artworks.length} of {uploadLimit} artworks uploaded
            </p>
          </div>
          <Button
            onClick={() => setShowUploadForm(true)}
            disabled={!canUpload}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Plus size={16} className="mr-2" />
            Add Artwork
          </Button>
        </div>
      )}

      {!canUpload && !showUploadForm && (
        <Alert className="border-destructive/50">
          <AlertDescription>
            Upload limit reached ({uploadLimit} artworks). Delete existing artworks to upload new ones.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork) => (
          <Card key={artwork.id} className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
            <div className="relative">
              {artwork.videoUrl ? (
                <video src={artwork.videoUrl} className="w-full h-48 object-cover" controls={false} muted />
              ) : (
                <img
                  src={artwork.imageUrl || "/placeholder.svg?height=200&width=300"}
                  alt={artwork.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <Badge className="absolute top-2 left-2" variant={artwork.videoUrl ? "secondary" : "default"}>
                {artwork.videoUrl ? "Video" : "Image"}
              </Badge>
              <Badge className="absolute top-2 right-2" variant={artwork.category === "shop" ? "default" : "outline"}>
                {artwork.category}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-serif font-semibold text-lg text-foreground mb-2">{artwork.title}</h3>
              <div className="space-y-1 text-sm text-muted-foreground mb-3">
                <p>
                  {artwork.medium} on {artwork.material}
                </p>
                <p>{artwork.size}</p>
                {artwork.price && <p className="font-semibold text-primary">UGX {artwork.price?.toLocaleString()}</p>}
                {artwork.isForSale && (
                  <Badge variant="secondary" className="text-xs">
                    For Sale
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{artwork.description}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(artwork)} className="flex-1">
                  <Edit size={14} className="mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(artwork)}
                  className="text-destructive hover:text-destructive"
                  disabled={loading}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
