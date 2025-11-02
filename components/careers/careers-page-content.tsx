"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Briefcase, Users, Clock, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import JobApplicationModal from "./job-application-modal"

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
  culture_video_url?: string
  about_text?: string
}

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
  currency?: string
  description?: string
  requirements?: string
  benefits?: string
  work_policy: string
  responsibilities?: string
}

export default function CareersPageContent({
  company,
  customization,
  jobs,
}: {
  company: Company
  customization: Customization | null
  jobs: Job[]
}) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [selectedJobType, setSelectedJobType] = useState<string>("")
  const [selectedExperience, setSelectedExperience] = useState<string>("")
  const [selectedWorkPolicy, setSelectedWorkPolicy] = useState<string>("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [showApplicationModal, setShowApplicationModal] = useState(false)

  const locations = useMemo(() => [...new Set(jobs.map((j) => j.location))].sort(), [jobs])
  const jobTypes = useMemo(() => [...new Set(jobs.map((j) => j.job_type))].sort(), [jobs])
  const experienceLevels = useMemo(() => [...new Set(jobs.map((j) => j.experience_level))].sort(), [jobs])
  const workPolicies = useMemo(() => [...new Set(jobs.map((j) => j.work_policy))].sort(), [jobs])
  const departments = useMemo(() => [...new Set(jobs.map((j) => j.department))].sort(), [jobs])

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesLocation = !selectedLocation || job.location === selectedLocation
      const matchesJobType = !selectedJobType || job.job_type === selectedJobType
      const matchesExperience = !selectedExperience || job.experience_level === selectedExperience
      const matchesWorkPolicy = !selectedWorkPolicy || job.work_policy === selectedWorkPolicy
      const matchesDepartment = !selectedDepartment || job.department === selectedDepartment

      return (
        matchesSearch &&
        matchesLocation &&
        matchesJobType &&
        matchesExperience &&
        matchesWorkPolicy &&
        matchesDepartment
      )
    })
  }, [jobs, searchQuery, selectedLocation, selectedJobType, selectedExperience, selectedWorkPolicy, selectedDepartment])

  const hasActiveFilters =
    selectedLocation || selectedJobType || selectedExperience || selectedWorkPolicy || selectedDepartment || searchQuery

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedLocation("")
    setSelectedJobType("")
    setSelectedExperience("")
    setSelectedWorkPolicy("")
    setSelectedDepartment("")
  }

  const primaryColor = customization?.primary_color || "#000000"
  const secondaryColor = customization?.secondary_color || "#ffffff"

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: secondaryColor,
      }}
    >
      {customization?.banner_image_url && (
        <div className="relative h-64 overflow-hidden">
          <img
            src={customization.banner_image_url || "/placeholder.svg"}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* Company Info with Glassmorphism */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-start gap-6 mb-12">
          {customization?.logo_url && (
            <img
              src={customization.logo_url || "/placeholder.svg"}
              alt={company.name}
              className="h-20 w-auto rounded-lg shadow-md backdrop-blur-sm"
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
            {customization?.about_text && (
              <p className="text-lg text-muted-foreground mb-4">{customization.about_text}</p>
            )}
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Visit Website
              </a>
            )}
          </div>
        </div>

        {/* Culture Video */}
        {customization?.culture_video_url && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Culture</h2>
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg backdrop-blur-sm">
              <iframe
                width="100%"
                height="100%"
                src={customization.culture_video_url}
                title="Company Culture"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Jobs Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Open Positions</h2>

          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Search by title, department, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full backdrop-blur-sm bg-white/50 border-white/20"
            />
          </div>

          {/* Filters with Glassmorphism */}
          <div className="mb-6 p-4 rounded-lg border backdrop-blur-xl bg-white/40 border-white/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                  <X className="w-4 h-4" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="backdrop-blur-sm bg-white/50 border-white/20">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                <SelectTrigger className="backdrop-blur-sm bg-white/50 border-white/20">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                <SelectTrigger className="backdrop-blur-sm bg-white/50 border-white/20">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedWorkPolicy} onValueChange={setSelectedWorkPolicy}>
                <SelectTrigger className="backdrop-blur-sm bg-white/50 border-white/20">
                  <SelectValue placeholder="Work Policy" />
                </SelectTrigger>
                <SelectContent>
                  {workPolicies.map((policy) => (
                    <SelectItem key={policy} value={policy}>
                      {policy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="backdrop-blur-sm bg-white/50 border-white/20">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Jobs List */}
            <div className="lg:col-span-1 space-y-3">
              {filteredJobs.length === 0 ? (
                <Card className="backdrop-blur-xl bg-white/40 border-white/20">
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    No jobs found matching your filters.
                  </CardContent>
                </Card>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground px-2">
                    {filteredJobs.length} position{filteredJobs.length !== 1 ? "s" : ""} found
                  </p>
                  {filteredJobs.map((job) => (
                    <Card
                      key={job.id}
                      className="cursor-pointer transition-all hover:shadow-md backdrop-blur-xl bg-white/40 border-white/20 hover:bg-white/60"
                      onClick={() => setSelectedJob(job)}
                      style={{
                        borderColor: selectedJob?.id === job.id ? primaryColor : undefined,
                        borderWidth: selectedJob?.id === job.id ? "2px" : undefined,
                      }}
                    >
                      <CardContent className="pt-4">
                        <h3 className="font-semibold line-clamp-2">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.department}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>

            {/* Job Details */}
            <div className="lg:col-span-2">
              {selectedJob ? (
                <Card className="backdrop-blur-xl bg-white/40 border-white/20">
                  <CardContent className="pt-6 space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{selectedJob.title}</h2>
                      <p className="text-muted-foreground">{selectedJob.department}</p>
                    </div>

                    {/* Job Meta */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="font-medium">{selectedJob.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Type</p>
                          <p className="font-medium">{selectedJob.job_type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Level</p>
                          <p className="font-medium">{selectedJob.experience_level}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Work Policy</p>
                          <p className="font-medium">{selectedJob.work_policy}</p>
                        </div>
                      </div>
                    </div>

                    {/* Salary */}
                    {selectedJob.salary_min && selectedJob.salary_max && (
                      <div className="p-4 rounded-lg backdrop-blur-sm" style={{ backgroundColor: `${primaryColor}20` }}>
                        <p className="text-sm text-muted-foreground">Salary Range</p>
                        <p className="text-lg font-semibold">
                          ${selectedJob.salary_min.toLocaleString()} - ${selectedJob.salary_max.toLocaleString()}{" "}
                          {selectedJob.currency}
                        </p>
                      </div>
                    )}

                    {/* Description */}
                    {selectedJob.description && (
                      <div>
                        <h3 className="font-semibold mb-2">About This Role</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{selectedJob.description}</p>
                      </div>
                    )}

                    {/* Requirements */}
                    {selectedJob.requirements && (
                      <div>
                        <h3 className="font-semibold mb-2">Requirements</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{selectedJob.requirements}</p>
                      </div>
                    )}

                    {selectedJob.responsibilities && (
                      <div>
                        <h3 className="font-semibold mb-2">Key Responsibilities</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{selectedJob.responsibilities}</p>
                      </div>
                    )}

                    {/* Benefits */}
                    {selectedJob.benefits && (
                      <div>
                        <h3 className="font-semibold mb-2">Benefits</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{selectedJob.benefits}</p>
                      </div>
                    )}

                    <Button
                      className="w-full text-white"
                      style={{
                        backgroundColor: primaryColor,
                      }}
                      onClick={() => setShowApplicationModal(true)}
                    >
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="backdrop-blur-xl bg-white/40 border-white/20">
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    Select a job to view details
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {showApplicationModal && selectedJob && (
        <JobApplicationModal
          job={selectedJob}
          company={company}
          onClose={() => setShowApplicationModal(false)}
          primaryColor={primaryColor}
        />
      )}
    </div>
  )
}
