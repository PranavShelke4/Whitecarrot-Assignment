import { createClient } from "@/lib/supabase/server"
import { sendApplicationConfirmationEmail } from "@/lib/utils/email"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      jobId,
      companyId,
      firstName,
      lastName,
      email,
      mobileNumber,
      resumeLink,
      linkedinLink,
      githubLink,
      joiningDays,
      customAnswers,
    } = body

    // Validate required fields
    if (!jobId || !companyId || !firstName || !lastName || !email || !mobileNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: jobData } = await supabase.from("jobs").select("title").eq("id", jobId).single()

    const { data: companyData } = await supabase.from("companies").select("name").eq("id", companyId).single()

    // Insert application
    const { data, error } = await supabase
      .from("job_applications")
      .insert({
        job_id: jobId,
        company_id: companyId,
        first_name: firstName,
        last_name: lastName,
        email,
        mobile_number: mobileNumber,
        resume_link: resumeLink,
        linkedin_link: linkedinLink,
        github_link: githubLink,
        joining_days: joiningDays,
        custom_answers: customAnswers,
      })
      .select()

    if (error) {
      console.error("Application error:", error)
      return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
    }

    if (jobData && companyData) {
      // Send confirmation email to candidate
      sendApplicationConfirmationEmail(email, `${firstName} ${lastName}`, jobData.title, companyData.name).catch(
        (err) => console.error("Failed to send confirmation email:", err),
      )
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
