"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSecretClick = () => {
    setClickCount((prev) => prev + 1)
    if (clickCount === 2) {
      // Third click (0, 1, 2)
      router.push("/admin")
      setClickCount(0)
    }
    // Reset count after 3 seconds if not completed
    setTimeout(() => setClickCount(0), 3000)
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/gallery", label: "Gallery" },
    { href: "/videos", label: "Videos" },
    { href: "/shop", label: "Shop" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-2xl lg:text-3xl font-serif font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Fashionistic Arts
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-foreground hover:text-primary transition-all duration-300 font-medium group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* CTA Button with Secret Access */}
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/shop">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105">
                Shop Art
              </Button>
            </Link>
            <div className="flex gap-1 ml-2">
              <button
                onClick={handleSecretClick}
                className="w-2 h-2 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/40 transition-colors duration-200"
                aria-hidden="true"
              />
              <button
                onClick={handleSecretClick}
                className="w-2 h-2 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/40 transition-colors duration-200"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground hover:text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border animate-fade-in">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-4">
                <Link href="/shop" className="flex-1">
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Shop Art
                  </Button>
                </Link>
                <div className="flex gap-1 mt-4">
                  <button
                    onClick={handleSecretClick}
                    className="w-3 h-3 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/40 transition-colors duration-200"
                    aria-hidden="true"
                  />
                  <button
                    onClick={handleSecretClick}
                    className="w-3 h-3 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/40 transition-colors duration-200"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
