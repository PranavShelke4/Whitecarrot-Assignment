"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Edit2, X } from "lucide-react"

interface Job {
  id: string
  title: string
  department: string
  location: string
  job_type: string
  employment_type: string
  experience_level: string
  salary_min?: number
  salary_max?: number
  work_policy: string
  order_index: number
  description?: string
  requirements?: string
  benefits?: string
  responsibilities?: string
}

export default function JobManagement({ companyId }: { companyId: string }) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Partial<Job>>({
    title: "",
    department: "",
    location: "",
    job_type: "Full-time",
    employment_type: "Permanent",
    experience_level: "Mid",
    work_policy: "Remote",
    description: "",
    requirements: "",
    benefits: "",
    responsibilities: "",
  })
  const supabase = createClient()

  useEffect(() => {
    fetchJobs()
  }, [companyId])

  const fetchJobs = async () => {
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .eq("company_id", companyId)
      .order("order_index", { ascending: true })

    if (data) {
      setJobs(data)
    }
    setLoading(false)
  }

  const handleAddJob = async () => {
    if (!formData.title || !formData.department || !formData.location) {
      return
    }

    if (editingId) {
      const { error } = await supabase.from("jobs").update(formData).eq("id", editingId)

      if (!error) {
        setEditingId(null)
        resetForm()
        fetchJobs()
      }
    } else {
      const { error } = await supabase.from("jobs").insert({
        company_id: companyId,
        ...formData,
        order_index: jobs.length,
      })

      if (!error) {
        resetForm()
        fetchJobs()
      }
    }
  }

  const handleEditJob = (job: Job) => {
    setEditingId(job.id)
    setFormData(job)
    setShowForm(true)
  }

  const handleDeleteJob = async (jobId: string) => {
    await supabase.from("jobs").delete().eq("id", jobId)
    fetchJobs()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      location: "",
      job_type: "Full-time",
      employment_type: "Permanent",
      experience_level: "Mid",
      work_policy: "Remote",
      description: "",
      requirements: "",
      benefits: "",
      responsibilities: "",
    })
    setShowForm(false)
  }

  if (loading) {
    return <div>Loading jobs...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Job Listings</h2>
          <p className="text-sm text-muted-foreground">Manage your open positions</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Job
        </Button>
      </div>

      {showForm && (
        <Card className="backdrop-blur-xl bg-white/40 border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>{editingId ? "Edit Job" : "Add New Job"}</CardTitle>
            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  placeholder="Job Title"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="backdrop-blur-sm bg-white/50 border-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Department *</label>
                <Input
                  placeholder="Department"
                  value={formData.department || ""}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="backdrop-blur-sm bg-white/50 border-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location *</label>
                <Input
                  placeholder="Location"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="backdrop-blur-sm bg-white/50 border-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Type</label>
                <Select
                  value={formData.job_type}
                  onValueChange={(value) => setFormData({ ...formData, job_type: value })}
                >
                  <SelectTrigger className="backdrop-blur-sm bg-white/50 border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience Level</label>
                <Select
                  value={formData.experience_level}
                  onValueChange={(value) => setFormData({ ...formData, experience_level: value })}
                >
                  <SelectTrigger className="backdrop-blur-sm bg-white/50 border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry">Entry</SelectItem>
                    <SelectItem value="Mid">Mid</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Work Policy</label>
                <Select
                  value={formData.work_policy}
                  onValueChange={(value) => setFormData({ ...formData, work_policy: value })}
                >
                  <SelectTrigger className="backdrop-blur-sm bg-white/50 border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="On-site">On-site</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Salary Min</label>
                <Input
                  type="number"
                  placeholder="50000"
                  value={formData.salary_min || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, salary_min: Number.parseInt(e.target.value) || undefined })
                  }
                  className="backdrop-blur-sm bg-white/50 border-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Salary Max</label>
                <Input
                  type="number"
                  placeholder="100000"
                  value={formData.salary_max || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, salary_max: Number.parseInt(e.target.value) || undefined })
                  }
                  className="backdrop-blur-sm bg-white/50 border-white/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Job description..."
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="backdrop-blur-sm bg-white/50 border-white/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Requirements</label>
              <Textarea
                placeholder="Job requirements..."
                value={formData.requirements || ""}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={3}
                className="backdrop-blur-sm bg-white/50 border-white/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Benefits</label>
              <Textarea
                placeholder="Job benefits..."
                value={formData.benefits || ""}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                rows={3}
                className="backdrop-blur-sm bg-white/50 border-white/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Responsibilities</label>
              <Textarea
                placeholder="Key responsibilities for this role..."
                value={formData.responsibilities || ""}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                rows={3}
                className="backdrop-blur-sm bg-white/50 border-white/20"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddJob} className="flex-1">
                {editingId ? "Update Job" : "Create Job"}
              </Button>
              <Button variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {jobs.map((job) => (
          <Card
            key={job.id}
            className="backdrop-blur-xl bg-white/40 border-white/20 hover:bg-white/60 transition-colors"
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {job.department} • {job.location} • {job.job_type}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-secondary/50 px-2 py-1 rounded backdrop-blur-sm">
                      {job.experience_level}
                    </span>
                    <span className="text-xs bg-secondary/50 px-2 py-1 rounded backdrop-blur-sm">
                      {job.work_policy}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditJob(job)} className="hover:bg-white/50">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteJob(job.id)}
                    className="hover:bg-white/50"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
