"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Loader2 } from "lucide-react"

interface Job {
  id: string
  title: string
}

interface Company {
  id: string
}

interface JobApplicationModalProps {
  job: Job
  company: Company
  onClose: () => void
  primaryColor: string
}

export default function JobApplicationModal({ job, company, onClose, primaryColor }: JobApplicationModalProps) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    resumeLink: "",
    linkedinLink: "",
    githubLink: "",
    joiningDays: "",
    experience: "",
    motivation: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          companyId: company.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          resumeLink: formData.resumeLink,
          linkedinLink: formData.linkedinLink,
          githubLink: formData.githubLink,
          joiningDays: Number.parseInt(formData.joiningDays),
          customAnswers: {
            experience: formData.experience,
            motivation: formData.motivation,
          },
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        alert("Failed to submit application. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md backdrop-blur-xl bg-white/90 border-white/20">
          <CardContent className="pt-6 text-center space-y-4">
            <div
              className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: primaryColor }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Application Submitted!</h3>
            <p className="text-sm text-muted-foreground">
              Thank you for applying. We'll review your application and get back to you soon.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl backdrop-blur-xl bg-white/95 border-white/20 my-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Apply for {job.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Fill in your details below</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="font-semibold mb-4 text-sm">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name *</label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                    className="backdrop-blur-sm bg-white/50 border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name *</label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                    className="backdrop-blur-sm bg-white/50 border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="backdrop-blur-sm bg-white/50 border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number *</label>
                  <Input
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    required
                    className="backdrop-blur-sm bg-white/50 border-white/20"
                  />
                </div>
              </div>
            </div>

            {/* Professional Links */}
            <div>
              <h3 className="font-semibold mb-4 text-sm">Professional Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resume Link</label>
                  <Input
                    name="resumeLink"
                    type="url"
                    value={formData.resumeLink}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="backdrop-blur-sm bg-white/50 border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn Profile</label>
                  <Input
                    name="linkedinLink"
                    type="url"
                    value={formData.linkedinLink}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className="backdrop-blur-sm bg-white/50 border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">GitHub Profile</label>
                  <Input
                    name="githubLink"
                    type="url"
                    value={formData.githubLink}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="backdrop-blur-sm bg-white/50 border-white/20"
                  />
                </div>
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="font-semibold mb-4 text-sm">Availability</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">When can you join? (days from now) *</label>
                <Input
                  name="joiningDays"
                  type="number"
                  value={formData.joiningDays}
                  onChange={handleChange}
                  placeholder="30"
                  required
                  min="0"
                  className="backdrop-blur-sm bg-white/50 border-white/20"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 text-white"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
