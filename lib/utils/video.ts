export function extractYouTubeVideoId(input: string): string | null {
  if (!input) return null

  // If it's already a clean embed URL, extract the ID
  const embedMatch = input.match(/youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/)
  if (embedMatch) {
    return embedMatch[1]
  }

  // If it's a full iframe tag, extract the src and then the ID
  const iframeMatch = input.match(/src=["']([^"']*youtube[^"']*?)["']/)
  if (iframeMatch) {
    const src = iframeMatch[1]
    const idMatch = src.match(/embed\/([a-zA-Z0-9_-]{11})/)
    if (idMatch) {
      return idMatch[1]
    }
  }

  // If it's a standard YouTube URL
  const youtubeMatch = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (youtubeMatch) {
    return youtubeMatch[1]
  }

  // If it's just the video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input
  }

  return null
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?controls=0`
}
