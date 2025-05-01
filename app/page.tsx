import ImageGenerator from "@/components/image-generator"

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4 md:py-12 md:px-8 max-w-6xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">xAI Image Generator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create stunning AI-generated images with xAI's Grok-2-image model
        </p>
      </div>

      <div className="bg-card/50 backdrop-blur-sm rounded-xl shadow-lg border border-border/40 p-6 md:p-8">
        <ImageGenerator />
      </div>
    </main>
  )
}
