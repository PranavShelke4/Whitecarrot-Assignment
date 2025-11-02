"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

interface Company {
  id: string
  name: string
  slug: string
  website?: string
  description?: string
}

interface Customization {
  primary_color: string
  secondary_color: string
  banner_image_url?: string
  logo_url?: string
  about_text?: string
}

interface Job {
  id: string
  title: string
  department: string
  location: string
  job_type: string
  experience_level: string
  work_policy: string
}

export default function DashboardPreview({ company }: { company: Company }) {
  const [customization, setCustomization] = useState<Customization | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const [customizationData, jobsData] = await Promise.all([
        supabase.from("company_customization").select("*").eq("company_id", company.id).single(),
        supabase.from("jobs").select("*").eq("company_id", company.id).order("order_index", { ascending: true }),
      ])

      if (customizationData.data) {
        setCustomization(customizationData.data)
      }
      if (jobsData.data) {
        setJobs(jobsData.data)
      }
      setLoading(false)
    }

    fetchData()
  }, [company.id, supabase])

  const careersUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/careers/${company.slug}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(careersUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return <div>Loading preview...</div>
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Share Your Careers Page</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={careersUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border rounded-md bg-muted text-sm"
                />
                <Button onClick={handleCopyLink} variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div
            className="rounded-lg overflow-hidden border"
            style={{
              backgroundColor: customization?.secondary_color || "#ffffff",
            }}
          >
            {customization?.banner_image_url && (
              <img
                src={customization.banner_image_url || "/placeholder.svg"}
                alt="Banner"
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-6 space-y-4">
              {customization?.logo_url && (
                <img src={customization.logo_url || "/placeholder.svg"} alt="Logo" className="h-12 w-auto" />
              )}

              <div>
                <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                {customization?.about_text && <p className="text-muted-foreground">{customization.about_text}</p>}
              </div>

              <div className="pt-4 border-t">
                <h2 className="text-xl font-semibold mb-4">Open Positions</h2>
                <div className="grid gap-3">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 rounded-lg border"
                      style={{
                        borderColor: customization?.primary_color || "#000000",
                      }}
                    >
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {job.department} • {job.location}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded bg-secondary">{job.job_type}</span>
                        <span className="text-xs px-2 py-1 rounded bg-secondary">{job.experience_level}</span>
                        <span className="text-xs px-2 py-1 rounded bg-secondary">{job.work_policy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
