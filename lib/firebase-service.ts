import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where } from "firebase/firestore"
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
}

const COLLECTION_NAME = "Fashionistic_Arts"
const SLIDER_COLLECTION_NAME = "Fashionistic_Arts_Slider"

// Upload file to Firebase Storage
export async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, `${COLLECTION_NAME}/${path}`)
  const snapshot = await uploadBytes(storageRef, file)
  return await getDownloadURL(snapshot.ref)
}

// Delete file from Firebase Storage
export async function deleteFile(url: string): Promise<void> {
  const fileRef = ref(storage, url)
  await deleteObject(fileRef)
}

// Add artwork to Firestore
export async function addArtwork(artwork: Omit<Artwork, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...artwork,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return docRef.id
}

// Get all artworks
export async function getArtworks(): Promise<Artwork[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Artwork,
  )
}

// Get artworks by category - Fixed to avoid composite index requirement
export async function getArtworksByCategory(category: "gallery" | "shop"): Promise<Artwork[]> {
  const q = query(collection(db, COLLECTION_NAME), where("category", "==", category))
  const querySnapshot = await getDocs(q)
  const artworks = querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Artwork,
  )

  // Sort by createdAt in memory to avoid composite index
  return artworks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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

// Get all slider images
export async function getSliderImages(): Promise<SliderImage[]> {
  const q = query(collection(db, SLIDER_COLLECTION_NAME), orderBy("order", "asc"))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as SliderImage,
  )
}

// Add slider image
export async function addSliderImage(
  sliderData: Omit<SliderImage, "id" | "createdAt" | "updatedAt" | "imageUrl" | "videoUrl">,
  file: File,
): Promise<string> {
  // Determine file type
  const fileType = file.type.startsWith("image/") ? "image" : "video"

  // Upload file
  const fileUrl = await uploadFile(file, `slider/${Date.now()}_${file.name}`)

  // Create the data object with proper field names
  const dataToSave = {
    ...sliderData,
    fileType,
    ...(fileType === "image" ? { imageUrl: fileUrl } : { videoUrl: fileUrl }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Add to Firestore
  const docRef = await addDoc(collection(db, SLIDER_COLLECTION_NAME), dataToSave)
  return docRef.id
}

// Delete slider image
export async function deleteSliderImage(id: string): Promise<void> {
  // Get the document to retrieve the file URL
  const docRef = doc(db, SLIDER_COLLECTION_NAME, id)
  const docSnap = await getDocs(query(collection(db, SLIDER_COLLECTION_NAME), where("__name__", "==", id)))

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

// Get videos specifically from slider collection
export async function getVideos(): Promise<SliderImage[]> {
  const q = query(collection(db, SLIDER_COLLECTION_NAME), where("fileType", "==", "video"), orderBy("order", "asc"))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as SliderImage,
  )
}

// Get all media from slider collection (both images and videos)
export async function getAllSliderMedia(): Promise<SliderImage[]> {
  try {
    const q = query(collection(db, SLIDER_COLLECTION_NAME), orderBy("order", "asc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as SliderImage,
    )
  } catch (error) {
    console.error("Error fetching slider media:", error)
    // Fallback: try without orderBy if index doesn't exist
    const q = query(collection(db, SLIDER_COLLECTION_NAME))
    const querySnapshot = await getDocs(q)
    const media = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as SliderImage,
    )
    // Sort by order in memory
    return media.sort((a, b) => (a.order || 0) - (b.order || 0))
  }
}
