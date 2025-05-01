"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Download, ImageIcon, History, X, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImagePreviewModal } from "@/components/image-preview-modal"
import { HistoryView } from "@/components/history-view"
import { generateId } from "@/lib/utils"
import type { HistoryItem } from "@/types/history"

type ImageData = {
  url?: string
  b64_json?: string
  revised_prompt?: string
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [imageCount, setImageCount] = useState("1")
  const [responseFormat, setResponseFormat] = useState("url")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<ImageData[]>([])
  const [revisedPrompt, setRevisedPrompt] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("generate")
  const [selectedImage, setSelectedImage] = useState<{
    url: string
    index: number
  } | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("xai-history")
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Failed to parse history:", e)
      }
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("xai-history", JSON.stringify(history))
  }, [history])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    setIsLoading(true)
    setError(null)
    setImages([])
    setRevisedPrompt(null)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          n: imageCount,
          responseFormat,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate images")
      }

      const data = await response.json()

      if (data.data && data.data.length > 0) {
        setImages(data.data)

        if (data.data[0].revised_prompt) {
          setRevisedPrompt(data.data[0].revised_prompt)
        }

        // Add to history
        const imageUrls = data.data.map((img: ImageData) =>
          responseFormat === "url" ? img.url : `data:image/jpeg;base64,${img.b64_json}`,
        )

        const historyItem: HistoryItem = {
          id: generateId(),
          prompt,
          revisedPrompt: data.data[0].revised_prompt,
          images: imageUrls,
          timestamp: Date.now(),
        }

        setHistory((prev) => [historyItem, ...prev])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  function downloadImage(imageData: ImageData, index: number) {
    try {
      if (responseFormat === "url" && imageData.url) {
        // 对于URL格式，直接打开新窗口下载
        window.open(imageData.url, "_blank")
      } else if (responseFormat === "b64_json" && imageData.b64_json) {
        // 对于Base64格式，创建下载链接
        const imageUrl = `data:image/jpeg;base64,${imageData.b64_json}`
        const link = document.createElement("a")
        link.href = imageUrl
        link.download = `xai-image-${index + 1}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error("Error downloading image:", error)
      setError("Failed to download image. Please try again.")
    }
  }

  function clearHistory() {
    setHistory([])
  }

  function deleteHistoryItem(id: string) {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  // Example prompts
  const examplePrompts = [
    "A futuristic cityscape with flying cars",
    "A serene mountain landscape at sunset",
    "A magical forest with glowing mushrooms",
    "An underwater scene with coral reefs",
  ]

  function setExamplePrompt(prompt: string) {
    setPrompt(prompt)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6 bg-muted/50 p-1 rounded-lg relative z-10">
          <TabsTrigger value="generate" className="elegant-tab rounded-md flex items-center gap-2 py-2.5 relative z-20">
            <ImageIcon className="h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="history" className="elegant-tab rounded-md flex items-center gap-2 py-2.5 relative z-20">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="animate-fade-in space-y-8 pt-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-base font-medium">
                What would you like to create?
              </Label>
              <div className="relative">
                <Input
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to generate..."
                  required
                  className="h-12 pl-4 pr-12 elegant-input"
                />
                {prompt && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setPrompt("")}
                    aria-label="Clear input"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
              <h3 className="font-medium mb-3 text-sm flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-foreground/70" />
                Inspiration
              </h3>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((examplePrompt) => (
                  <button
                    key={examplePrompt}
                    type="button"
                    onClick={() => setExamplePrompt(examplePrompt)}
                    className="text-sm px-3 py-1.5 bg-background/80 rounded-md border border-border/50 hover:bg-background hover:border-border elegant-button"
                  >
                    {examplePrompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="imageCount" className="text-sm font-medium">
                  Number of images
                </Label>
                <Select value={imageCount} onValueChange={setImageCount}>
                  <SelectTrigger id="imageCount" className="elegant-input">
                    <SelectValue placeholder="Select count" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()} className="cursor-pointer">
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responseFormat" className="text-sm font-medium">
                  Response format
                </Label>
                <Select value={responseFormat} onValueChange={setResponseFormat}>
                  <SelectTrigger id="responseFormat" className="elegant-input">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="url" className="cursor-pointer">
                      URL
                    </SelectItem>
                    <SelectItem value="b64_json" className="cursor-pointer">
                      Base64 JSON
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 font-medium elegant-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Images"
              )}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="animate-fade-in">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {revisedPrompt && (
            <div className="bg-muted/30 p-4 rounded-lg text-sm border border-border/30 animate-fade-in">
              <p className="font-medium mb-1">Revised prompt:</p>
              <p className="text-muted-foreground">{revisedPrompt}</p>
            </div>
          )}

          {images.length > 0 && (
            <div className="animate-fade-up">
              <h3 className="text-lg font-medium mb-4">Generated Images</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="elegant-image-card group cursor-pointer"
                    onClick={() =>
                      setSelectedImage({
                        url: responseFormat === "url" ? image.url! : `data:image/jpeg;base64,${image.b64_json}`,
                        index,
                      })
                    }
                  >
                    <div className="relative aspect-square">
                      <img
                        src={responseFormat === "url" ? image.url : `data:image/jpeg;base64,${image.b64_json}`}
                        alt={`Generated image ${index + 1}`}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute bottom-3 right-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md elegant-button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          downloadImage(image, index)
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="animate-fade-in pt-2">
          <HistoryView history={history} onClearHistory={clearHistory} onDeleteItem={deleteHistoryItem} />
        </TabsContent>
      </Tabs>

      {selectedImage && (
        <ImagePreviewModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.url}
          onDownload={() => {
            const image = images[selectedImage.index]
            downloadImage(image, selectedImage.index)
          }}
        />
      )}
    </div>
  )
}
