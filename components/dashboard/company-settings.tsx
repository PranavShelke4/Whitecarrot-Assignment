"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { extractYouTubeVideoId, getYouTubeEmbedUrl } from "@/lib/utils/video"
import { AlertCircle } from "lucide-react"

interface Company {
  id: string
  name: string
  slug: string
  website?: string
  description?: string
}

interface Customization {
  id: string
  company_id: string
  primary_color: string
  secondary_color: string
  banner_image_url?: string
  logo_url?: string
  culture_video_url?: string
  about_text?: string
}

export default function CompanySettings({ company }: { company: Company }) {
  const [customization, setCustomization] = useState<Customization | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoInputError, setVideoInputError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchCustomization = async () => {
      const { data } = await supabase.from("company_customization").select("*").eq("company_id", company.id).single()

      if (data) {
        setCustomization(data)
      }
      setLoading(false)
    }

    fetchCustomization()
  }, [company.id, supabase])

  const handleVideoChange = (value: string) => {
    setVideoInputError(null)

    if (!value) {
      setCustomization({ ...customization!, culture_video_url: "" })
      return
    }

    const videoId = extractYouTubeVideoId(value)
    if (!videoId) {
      setVideoInputError("Please enter a valid YouTube URL, video ID, or iframe embed code")
      return
    }

    // Store the clean embed URL
    const embedUrl = getYouTubeEmbedUrl(videoId)
    setCustomization({ ...customization!, culture_video_url: embedUrl })
  }

  const handleSave = async () => {
    if (!customization) return

    setSaving(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from("company_customization")
        .update({
          primary_color: customization.primary_color,
          secondary_color: customization.secondary_color,
          banner_image_url: customization.banner_image_url,
          logo_url: customization.logo_url,
          culture_video_url: customization.culture_video_url,
          about_text: customization.about_text,
        })
        .eq("id", customization.id)

      if (updateError) {
        setError(updateError.message)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!customization) {
    return <div>No customization found</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>Customize the look and feel of your careers page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="primary-color" className="text-sm font-medium">
                Primary Color
              </label>
              <div className="flex gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={customization.primary_color}
                  onChange={(e) => setCustomization({ ...customization, primary_color: e.target.value })}
                  className="w-12 h-10"
                />
                <Input
                  type="text"
                  value={customization.primary_color}
                  onChange={(e) => setCustomization({ ...customization, primary_color: e.target.value })}
                  placeholder="#000000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="secondary-color" className="text-sm font-medium">
                Secondary Color
              </label>
              <div className="flex gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={customization.secondary_color}
                  onChange={(e) => setCustomization({ ...customization, secondary_color: e.target.value })}
                  className="w-12 h-10"
                />
                <Input
                  type="text"
                  value={customization.secondary_color}
                  onChange={(e) => setCustomization({ ...customization, secondary_color: e.target.value })}
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
          <CardDescription>Add images and videos to your careers page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="banner" className="text-sm font-medium">
              Banner Image URL
            </label>
            <Input
              id="banner"
              type="url"
              placeholder="https://example.com/banner.jpg"
              value={customization.banner_image_url || ""}
              onChange={(e) => setCustomization({ ...customization, banner_image_url: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="logo" className="text-sm font-medium">
              Logo URL
            </label>
            <Input
              id="logo"
              type="url"
              placeholder="https://example.com/logo.png"
              value={customization.logo_url || ""}
              onChange={(e) => setCustomization({ ...customization, logo_url: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="video" className="text-sm font-medium">
              Culture Video
            </label>
            <Input
              id="video"
              placeholder="Paste YouTube URL, video ID, or iframe embed code"
              value={customization.culture_video_url || ""}
              onChange={(e) => handleVideoChange(e.target.value)}
            />
            {videoInputError && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                {videoInputError}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Accepts: YouTube URLs, video IDs, or full iframe embed codes
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Tell candidates about your company culture</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="about" className="text-sm font-medium">
              About Text
            </label>
            <Textarea
              id="about"
              placeholder="Tell us about your company..."
              value={customization.about_text || ""}
              onChange={(e) => setCustomization({ ...customization, about_text: e.target.value })}
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )
}
