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

const COLLECTION_NAME = "Fashionistic_Arts"

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

// Get artworks by category
export async function getArtworksByCategory(category: "gallery" | "shop"): Promise<Artwork[]> {
  const q = query(collection(db, COLLECTION_NAME), where("category", "==", category), orderBy("createdAt", "desc"))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Artwork,
  )
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
