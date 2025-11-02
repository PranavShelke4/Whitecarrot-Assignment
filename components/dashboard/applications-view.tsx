"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, FileText, Linkedin, Github } from "lucide-react"

interface Application {
  id: string
  first_name: string
  last_name: string
  email: string
  mobile_number: string
  resume_link?: string
  linkedin_link?: string
  github_link?: string
  joining_days?: number
  created_at: string
  job: {
    title: string
  }
}

export default function ApplicationsView({ companyId }: { companyId: string }) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchApplications()
  }, [companyId])

  const fetchApplications = async () => {
    const { data } = await supabase
      .from("job_applications")
      .select(
        `
        id,
        first_name,
        last_name,
        email,
        mobile_number,
        resume_link,
        linkedin_link,
        github_link,
        joining_days,
        created_at,
        job:jobs(title)
      `,
      )
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })

    if (data) {
      setApplications(data as Application[])
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center py-8">Loading applications...</div>
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Applications Received</h2>
        <p className="text-sm text-muted-foreground">Total: {applications.length} applications</p>
      </div>

      {applications.length === 0 ? (
        <Card className="backdrop-blur-xl bg-white/40 border-white/20">
          <CardContent className="pt-6 text-center text-muted-foreground">
            No applications received yet. Share your careers page to start receiving applications.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Card
              key={app.id}
              className="backdrop-blur-xl bg-white/40 border-white/20 hover:bg-white/60 transition-colors"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {app.first_name} {app.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{app.job.title}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary" className="gap-1">
                        <Mail className="w-3 h-3" />
                        {app.email}
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        <Phone className="w-3 h-3" />
                        {app.mobile_number}
                      </Badge>
                      {app.joining_days && <Badge variant="secondary">Can join in {app.joining_days} days</Badge>}
                    </div>

                    <div className="flex gap-2">
                      {app.resume_link && (
                        <a
                          href={app.resume_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          Resume
                        </a>
                      )}
                      {app.linkedin_link && (
                        <a
                          href={app.linkedin_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Linkedin className="w-3 h-3" />
                          LinkedIn
                        </a>
                      )}
                      {app.github_link && (
                        <a
                          href={app.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Github className="w-3 h-3" />
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    {new Date(app.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
