// Email validation utility
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

export async function sendApplicationConfirmationEmail(
  candidateEmail: string,
  candidateName: string,
  jobTitle: string,
  companyName: string,
) {
  try {
    console.log("Sending confirmation email to:", candidateEmail, "for candidate:", candidateName)
    
    // Check if API key is available
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured")
      return
    }
    
    // Validate email format
    if (!candidateEmail || !isValidEmail(candidateEmail)) {
      console.error("Invalid candidate email format:", candidateEmail)
      return
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "noreply@resend.dev",
        to: candidateEmail.trim(),
        subject: `Application Received - ${jobTitle} at ${companyName}`,
        html: `
          <h2>Thank you for applying!</h2>
          <p>Hi ${candidateName},</p>
          <p>We have received your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
          <p>Our team will review your application and get back to you within 5-7 business days.</p>
          <p>Best regards,<br/>The ${companyName} Team</p>
        `,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Failed to send email:", errorText)
      throw new Error(`Email API error: ${response.status} ${errorText}`)
    }
  } catch (error) {
    console.error("Email service error:", error)
    throw error
  }
}
