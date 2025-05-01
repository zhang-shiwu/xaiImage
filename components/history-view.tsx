"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Trash2, Clock } from "lucide-react"
import { ImagePreviewModal } from "@/components/image-preview-modal"
import { formatDate } from "@/lib/utils"
import type { HistoryItem } from "@/types/history"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface HistoryViewProps {
  history: HistoryItem[]
  onClearHistory: () => void
  onDeleteItem: (id: string) => void
}

export function HistoryView({ history, onClearHistory, onDeleteItem }: HistoryViewProps) {
  const [selectedImage, setSelectedImage] = useState<{
    url: string
    id: string
  } | null>(null)

  // Pagination state
  const itemsPerPage = 3
  const [currentPage, setCurrentPage] = useState(1)
  const [paginatedHistory, setPaginatedHistory] = useState<HistoryItem[]>([])
  const totalPages = Math.ceil(history.length / itemsPerPage)

  // Update paginated history when page changes or history changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedHistory(history.slice(startIndex, endIndex))
  }, [currentPage, history, itemsPerPage])

  // Reset to page 1 if we delete items and current page becomes invalid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  const downloadImage = (imageUrl: string, id: string) => {
    try {
      // 检查是否是base64数据
      if (imageUrl.startsWith("data:")) {
        // 对于Base64格式，创建下载链接
        const link = document.createElement("a")
        link.href = imageUrl
        link.download = `xai-image-${id}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // 对于URL格式，直接打开新窗口
        window.open(imageUrl, "_blank")
      }
    } catch (error) {
      console.error("Error downloading image:", error)
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => goToPage(i)} isActive={currentPage === i} className="elegant-button">
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => goToPage(1)} isActive={currentPage === 1} className="elegant-button">
            1
          </PaginationLink>
        </PaginationItem>,
      )

      // Show ellipsis or pages before current
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      } else if (currentPage > 2) {
        items.push(
          <PaginationItem key={2}>
            <PaginationLink onClick={() => goToPage(2)} isActive={currentPage === 2} className="elegant-button">
              2
            </PaginationLink>
          </PaginationItem>,
        )
      }

      // Current page (if not first or last)
      if (currentPage !== 1 && currentPage !== totalPages) {
        items.push(
          <PaginationItem key={currentPage}>
            <PaginationLink onClick={() => goToPage(currentPage)} isActive={true} className="elegant-button">
              {currentPage}
            </PaginationLink>
          </PaginationItem>,
        )
      }

      // Show ellipsis or pages after current
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      } else if (currentPage < totalPages - 1) {
        items.push(
          <PaginationItem key={totalPages - 1}>
            <PaginationLink
              onClick={() => goToPage(totalPages - 1)}
              isActive={currentPage === totalPages - 1}
              className="elegant-button"
            >
              {totalPages - 1}
            </PaginationLink>
          </PaginationItem>,
        )
      }

      // Show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => goToPage(totalPages)}
            isActive={currentPage === totalPages}
            className="elegant-button"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
        <div className="text-5xl mb-6 text-muted-foreground/50">📷</div>
        <h3 className="text-xl font-medium mb-2">No history yet</h3>
        <p className="text-muted-foreground">Generated images will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Generation History
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearHistory}
          className="text-muted-foreground hover:text-destructive elegant-button"
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-10">
        {paginatedHistory.map((item) => (
          <div key={item.id} className="space-y-4 elegant-card p-5 animate-fade-up">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{formatDate(item.timestamp)}</p>
                <p className="text-sm text-muted-foreground truncate max-w-md mt-1">{item.prompt}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteItem(item.id)}
                className="elegant-button text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {item.images.map((image, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="elegant-image-card group cursor-pointer"
                  onClick={() => setSelectedImage({ url: image, id: `${item.id}-${index}` })}
                >
                  <div className="relative aspect-square">
                    <img
                      src={image || "/placeholder.svg"}
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
                        downloadImage(image, `${item.id}-${index}`)
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious onClick={() => goToPage(currentPage - 1)} className="elegant-button" />
              </PaginationItem>
            )}

            {renderPaginationItems()}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext onClick={() => goToPage(currentPage + 1)} className="elegant-button" />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}

      {selectedImage && (
        <ImagePreviewModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.url}
          onDownload={() => downloadImage(selectedImage.url, selectedImage.id)}
        />
      )}
    </div>
  )
}
