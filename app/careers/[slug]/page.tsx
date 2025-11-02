import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import CareersPageContent from "@/components/careers/careers-page-content"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: company } = await supabase.from("companies").select("*").eq("slug", slug).single()

  if (!company) {
    return {
      title: "Careers",
    }
  }

  return {
    title: `${company.name} - Careers`,
    description: company.description || `Join ${company.name}`,
  }
}

export default async function CareersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const [companyResult, customizationResult, jobsResult] = await Promise.all([
    supabase.from("companies").select("*").eq("slug", slug).single(),
    supabase
      .from("company_customization")
      .select("*")
      .eq("company_id", (await supabase.from("companies").select("id").eq("slug", slug).single()).data?.id)
      .single(),
    supabase
      .from("jobs")
      .select("*")
      .eq("company_id", (await supabase.from("companies").select("id").eq("slug", slug).single()).data?.id)
      .order("order_index", { ascending: true }),
  ])

  if (!companyResult.data) {
    notFound()
  }

  const company = companyResult.data
  const customization = customizationResult.data
  const jobs = jobsResult.data || []

  return <CareersPageContent company={company} customization={customization} jobs={jobs} />
}
