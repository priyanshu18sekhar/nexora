import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Nexora <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Nexora!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Welcome to Nexora, ${name}!</h1>
          <p>We're thrilled to have you join our platform for professional growth and skill development.</p>
          <p>With Nexora, you can:</p>
          <ul>
            <li>Access expert-led courses</li>
            <li>Apply for exclusive internships</li>
            <li>Connect with industry mentors</li>
            <li>Earn verified certificates</li>
          </ul>
          <p>Get started by exploring our courses or setting up your profile.</p>
          <div style="margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; rounded: 8px; font-weight: bold;">
               Go to Dashboard
            </a>
          </div>
          <p style="margin-top: 40px; color: #666; font-size: 12px;">
            If you have any questions, feel free to reply to this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending welcome email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error sending email:", error);
    return { success: false, error };
  }
};

export const sendInternshipApplicationEmail = async (
  email: string,
  name: string,
  internshipTitle: string
) => {
  try {
    await resend.emails.send({
      from: "Nexora <onboarding@resend.dev>",
      to: [email],
      subject: `Application Received: ${internshipTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Application Received</h2>
          <p>Hi ${name},</p>
          <p>Your application for the <strong>${internshipTitle}</strong> position has been successfully submitted.</p>
          <p>The recruiter will review your profile and get back to you if there's a match.</p>
          <p>You can track your application status in your dashboard.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending internship email:", error);
  }
};
