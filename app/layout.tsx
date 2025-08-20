import type React from "react"
import type { Metadata } from "next"
import { Work_Sans, Open_Sans } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/hooks/use-cart"
import { ShoppingCartSheet } from "@/components/shopping-cart"

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: ["300", "400", "500", "600", "700"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Fashionistic Arts - Where Creativity Meets Vision",
  description: "Luxury art gallery showcasing contemporary artworks with modern e-commerce functionality",
  generator: "v0.app",
  keywords: "art, gallery, luxury, contemporary, artworks, e-commerce, fashion, creative",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${workSans.variable} ${openSans.variable} dark`}>
      <body className="antialiased">
        <CartProvider>
          {children}
          <ShoppingCartSheet />
        </CartProvider>
      </body>
    </html>
  )
}
