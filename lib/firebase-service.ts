import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage } from "./firebase"

export interface Artwork {
  id?: string
  title: string
  description: string
  size: string
  material: string
  medium: string
  price?: number
  imageUrl: string
  videoUrl?: string
  isForSale: boolean
  category: "gallery" | "shop"
  createdAt: Date
  updatedAt: Date
  storageFolder?: string
}

export interface SliderImage {
  id: string
  title: string
  artist: string
  medium: string
  imageUrl?: string
  videoUrl?: string
  fileType: "image" | "video"
  order: number
  createdAt: Date
  updatedAt: Date
  storageFolder?: string
}

const COLLECTION_NAME = "Fashionistic_Arts"
const STORAGE_PATHS = {
  IMAGES: "images",
  SLIDER: "slider",
  VIDEOS: "videos",
}

// Upload file to Firebase Storage with correct folder structure
export async function uploadFile(
  file: File,
  folder: "images" | "slider" | "videos",
  fileName?: string,
): Promise<string> {
  const finalFileName = fileName || `${Date.now()}_${file.name}`
  const storageRef = ref(storage, `${COLLECTION_NAME}/${folder}/${finalFileName}`)
  const snapshot = await uploadBytes(storageRef, file)
  return await getDownloadURL(snapshot.ref)
}

// Delete file from Firebase Storage
export async function deleteFile(url: string): Promise<void> {
  const fileRef = ref(storage, url)
  await deleteObject(fileRef)
}

// Add artwork to Firestore
export async function addArtwork(
  artwork: Omit<Artwork, "id" | "createdAt" | "updatedAt">,
  folder: "images" | "shop" = "images",
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...artwork,
    storageFolder: folder,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return docRef.id
}

// Get all artworks
export async function getArtworks(): Promise<Artwork[]> {
  try {
    console.log("[v0] Fetching all artworks from Fashionistic_Arts collection...")
    const q = query(collection(db, COLLECTION_NAME))
    const querySnapshot = await getDocs(q)
    const artworks = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Artwork,
    )

    // Filter out slider and video items, only return actual artworks
    const filteredArtworks = artworks.filter(
      (artwork) => !artwork.storageFolder || artwork.storageFolder === "images" || artwork.storageFolder === "shop",
    )

    console.log("[v0] Found artworks:", filteredArtworks.length)
    return filteredArtworks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("[v0] Error fetching artworks:", error)
    return []
  }
}

// Get artworks by category - Fixed to avoid composite index requirement
export async function getArtworksByCategory(category: "gallery" | "shop"): Promise<Artwork[]> {
  try {
    console.log(`[v0] Fetching ${category} artworks from Fashionistic_Arts collection...`)
    const q = query(collection(db, COLLECTION_NAME), where("category", "==", category))
    const querySnapshot = await getDocs(q)
    const artworks = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Artwork,
    )

    // Filter out slider and video items, only return actual artworks
    const filteredArtworks = artworks.filter(
      (artwork) => !artwork.storageFolder || artwork.storageFolder === "images" || artwork.storageFolder === "shop",
    )

    console.log(`[v0] Found ${category} artworks:`, filteredArtworks.length)
    // Sort by createdAt in memory to avoid composite index
    return filteredArtworks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error(`[v0] Error fetching ${category} artworks:`, error)
    return []
  }
}

// Update artwork
export async function updateArtwork(id: string, updates: Partial<Artwork>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date(),
  })
}

// Delete artwork
export async function deleteArtwork(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id)
  await deleteDoc(docRef)
}

// Get artwork count
export async function getArtworkCount(): Promise<number> {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
  return querySnapshot.size
}

export async function getAllSliderMedia(): Promise<SliderImage[]> {
  try {
    console.log("[v0] Fetching slider media from Fashionistic_Arts collection with slider folder...")
    const q = query(collection(db, COLLECTION_NAME), where("storageFolder", "==", "slider"))
    const querySnapshot = await getDocs(q)
    const media = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as SliderImage,
    )

    console.log("[v0] Found slider media:", media.length, media)
    return media.sort((a, b) => (a.order || 0) - (b.order || 0))
  } catch (error) {
    console.error("[v0] Error fetching slider media:", error)
    return []
  }
}

// Add slider image/video
export async function addSliderImage(
  sliderData: Omit<SliderImage, "id" | "createdAt" | "updatedAt" | "imageUrl" | "videoUrl">,
  file: File,
): Promise<string> {
  const fileType = file.type.startsWith("image/") ? "image" : "video"
  const fileUrl = await uploadFile(file, "slider")

  const dataToSave = {
    ...sliderData,
    fileType,
    storageFolder: "slider",
    ...(fileType === "image" ? { imageUrl: fileUrl } : { videoUrl: fileUrl }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const docRef = await addDoc(collection(db, COLLECTION_NAME), dataToSave)
  console.log("[v0] Added slider media:", docRef.id)
  return docRef.id
}

// Delete slider image
export async function deleteSliderImage(id: string): Promise<void> {
  // Get the document to retrieve the file URL
  const docRef = doc(db, COLLECTION_NAME, id)
  const docSnap = await getDocs(query(collection(db, COLLECTION_NAME), where("__name__", "==", id)))

  if (!docSnap.empty) {
    const data = docSnap.docs[0].data() as SliderImage
    const fileUrl = data.imageUrl || data.videoUrl
    if (fileUrl) {
      // Delete the file from storage
      try {
        await deleteFile(fileUrl)
      } catch (error) {
        console.warn("Failed to delete file from storage:", error)
      }
    }
  }

  // Delete the document
  await deleteDoc(docRef)
}

export async function getVideosFromCollection(): Promise<SliderImage[]> {
  try {
    console.log("[v0] Fetching videos from Fashionistic_Arts collection with videos folder...")
    const q = query(collection(db, COLLECTION_NAME), where("storageFolder", "==", "videos"))
    const querySnapshot = await getDocs(q)
    const videos = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as SliderImage,
    )
    console.log("[v0] Found videos in videos folder:", videos.length, videos)
    return videos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("[v0] Error fetching videos from collection:", error)
    return []
  }
}

export async function addVideoToCollection(
  videoData: Omit<SliderImage, "id" | "createdAt" | "updatedAt" | "videoUrl">,
  file: File,
): Promise<string> {
  const videoUrl = await uploadFile(file, "videos")

  const dataToSave = {
    ...videoData,
    fileType: "video" as const,
    storageFolder: "videos",
    videoUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const docRef = await addDoc(collection(db, COLLECTION_NAME), dataToSave)
  console.log("[v0] Added video to videos folder:", docRef.id)
  return docRef.id
}

export async function getVideos(): Promise<SliderImage[]> {
  try {
    console.log("[v0] Fetching all videos from videos folder...")
    const videos = await getVideosFromCollection()
    console.log("[v0] Total videos found:", videos.length)
    return videos
  } catch (error) {
    console.error("[v0] Error getting videos:", error)
    return []
  }
}

// Get slider images only (not videos)
export async function getSliderImages(): Promise<SliderImage[]> {
  try {
    const allSliderMedia = await getAllSliderMedia()
    return allSliderMedia.filter((media) => media.fileType === "image")
  } catch (error) {
    console.error("Error fetching slider images:", error)
    return []
  }
}
