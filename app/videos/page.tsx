import { Navigation } from "@/components/navigation"
import { VideoGrid } from "@/components/video-grid"
import { Footer } from "@/components/footer"

export default function VideosPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
        {/* Videos Header */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Videos</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Watch the creative process unfold through our collection of artistic videos and behind-the-scenes content.
            </p>
          </div>
        </section>

        {/* Video Grid */}
        <VideoGrid />
      </div>
      <Footer />
    </main>
  )
}
