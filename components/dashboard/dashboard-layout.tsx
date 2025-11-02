"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CompanySettings from "./company-settings"
import JobManagement from "./job-management"
import DashboardPreview from "./dashboard-preview"
import ApplicationsView from "./applications-view"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { FileText, Settings, Eye, Mail } from "lucide-react"

interface Company {
  id: string
  name: string
  slug: string
  website?: string
  description?: string
}

export default function DashboardLayout({ company }: { company: Company }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="glass border-b bg-white/60 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-sm text-gray-600">Careers Page Management</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="glass-card hover:bg-gray-50 transition-all duration-200"
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="glass-card mb-8 p-1 w-full max-w-2xl mx-auto">
            <TabsTrigger value="jobs" className="flex-1 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <FileText className="w-4 h-4" />
              Job Management
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex-1 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Mail className="w-4 h-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Settings className="w-4 h-4" />
              Company Settings
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Eye className="w-4 h-4" />
              Live Preview
            </TabsTrigger>
          </TabsList>

          <div className="space-y-6">
            <TabsContent value="jobs" className="glass-card p-6 rounded-xl">
              <JobManagement companyId={company.id} />
            </TabsContent>

            <TabsContent value="applications" className="glass-card p-6 rounded-xl">
              <ApplicationsView companyId={company.id} />
            </TabsContent>

            <TabsContent value="settings" className="glass-card p-6 rounded-xl">
              <CompanySettings company={company} />
            </TabsContent>

            <TabsContent value="preview" className="glass-card p-6 rounded-xl">
              <DashboardPreview company={company} />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
