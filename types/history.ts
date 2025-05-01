export interface HistoryItem {
  id: string
  prompt: string
  revisedPrompt?: string
  images: string[]
  timestamp: number
}
