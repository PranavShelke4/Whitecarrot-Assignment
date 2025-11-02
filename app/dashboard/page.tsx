import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: companies } = await supabase.from("companies").select("*").eq("user_id", user.id)

  if (!companies || companies.length === 0) {
    redirect("/dashboard/create-company")
  }

  const company = companies[0]

  return <DashboardLayout company={company} />
}
