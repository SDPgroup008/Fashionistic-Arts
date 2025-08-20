"use client"

import Link from "next/link"
import { Instagram, Youtube, Mail, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block mb-4">
                <h2 className="text-2xl font-serif font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Fashionistic Arts
                </h2>
              </Link>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
                Where creativity meets vision. Discover contemporary artworks that blend traditional techniques with
                modern innovation, each piece telling a story of artistic excellence.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center text-white hover:scale-105 transition-transform duration-300"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white hover:scale-105 transition-transform duration-300"
                  aria-label="Subscribe to our YouTube channel"
                >
                  <Youtube size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center text-primary-foreground hover:scale-105 transition-transform duration-300"
                  aria-label="Follow us on TikTok"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
                <a
                  href="mailto:reinolmartin001@gmail.com"
                  className="w-10 h-10 bg-muted hover:bg-muted/80 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-300"
                  aria-label="Send us an email"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-serif font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/videos"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    Videos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-serif font-semibold text-foreground mb-4">Services</h3>
              <ul className="space-y-3">
                <li>
                  <span className="text-muted-foreground">Original Artworks</span>
                </li>
                <li>
                  <span className="text-muted-foreground">Custom Commissions</span>
                </li>
                <li>
                  <span className="text-muted-foreground">Art Consultation</span>
                </li>
                <li>
                  <span className="text-muted-foreground">Digital Art</span>
                </li>
                <li>
                  <span className="text-muted-foreground">Art Tutorials</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 Fashionistic Arts – All Rights Reserved</p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="gap-2 text-muted-foreground hover:text-primary"
              >
                <ArrowUp size={14} />
                Back to Top
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
