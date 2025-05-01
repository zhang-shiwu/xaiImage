"use client"

import { Dialog, DialogContent, DialogDescription } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

interface ImagePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  onDownload: () => void
}

export function ImagePreviewModal({ isOpen, onClose, imageUrl, onDownload }: ImagePreviewModalProps) {
  // 直接下载图片的函数，作为备用方案
  const directDownload = () => {
    try {
      if (imageUrl.startsWith("data:")) {
        // 对于Base64格式
        const link = document.createElement("a")
        link.href = imageUrl
        link.download = `xai-image.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // 对于URL格式
        window.open(imageUrl, "_blank")
      }
    } catch (error) {
      console.error("Error downloading image:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-transparent border-0 shadow-2xl">
        <DialogDescription className="sr-only">Image preview from xAI image generation</DialogDescription>
        <div className="relative">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-auto max-h-[85vh] object-contain bg-black/80"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full shadow-lg backdrop-blur-md bg-black/30 hover:bg-black/50 border-0 elegant-button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                try {
                  onDownload()
                } catch (error) {
                  // 如果主下载方法失败，尝试直接下载
                  directDownload()
                }
              }}
            >
              <Download className="h-4 w-4 text-white" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full shadow-lg backdrop-blur-md bg-black/30 hover:bg-black/50 border-0 elegant-button"
              onClick={onClose}
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
