export async function sendWelcomeEmail(email: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  const subject = "Welcome to ContextSkeleton - 10 Free Proposal Credits Activated! 🚀";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #090b11; color: #f8fafc; padding: 30px; border-radius: 16px; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #a855f7; font-size: 28px; margin: 0;">ContextSkeleton</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Autonomous B2B RFP & Tender Response Engine</p>
      </div>

      <h2 style="color: #ffffff; font-size: 20px;">Welcome aboard!</h2>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
        Your account is ready with <strong>10 Free Proposal Drafting Credits</strong>.
      </p>

      <div style="background-color: #0f172a; padding: 20px; border-radius: 12px; border: 1px solid #334155; margin: 20px 0;">
        <h3 style="color: #818cf8; font-size: 16px; margin-top: 0;">Quick 3-Step Setup Guide:</h3>
        <ol style="color: #94a3b8; font-size: 13px; line-height: 1.8; padding-left: 20px;">
          <li><strong style="color: #f8fafc;">Upload Source Docs:</strong> Go to <a href="https://contextskeleton.com/knowledge" style="color: #a855f7;">Knowledge Base</a> and upload past bids, ISO policies, or brochures.</li>
          <li><strong style="color: #f8fafc;">Create a Project:</strong> Paste your incoming RFP questions.</li>
          <li><strong style="color: #f8fafc;">Export to Word:</strong> Click "Export to Word (.docx)" for a ready-to-submit tender response!</li>
        </ol>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://contextskeleton.com/dashboard" style="background-color: #7c3aed; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 24px; border-radius: 10px; display: inline-block;">
          Go to Dashboard &rarr;
        </a>
      </div>

      <hr style="border: 0; border-top: 1px solid #1e293b; margin: 30px 0;" />
      <p style="color: #64748b; font-size: 11px; text-align: center;">
        Need custom enterprise setup or private database clusters? Reply directly to this email or visit <a href="https://contextskeleton.com" style="color: #a855f7;">contextskeleton.com</a>.
      </p>
    </div>
  `;

  if (!apiKey) {
    console.log(`[Email Service - Sandbox] Welcome email queued for ${email}. (Set RESEND_API_KEY in Vercel to send live emails)`);
    return true;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ContextSkeleton <onboarding@contextskeleton.com>',
        to: [email],
        subject,
        html,
      }),
    });

    if (res.ok) {
      console.log(`[Email Service] Live welcome email sent successfully to ${email}`);
      return true;
    } else {
      const errText = await res.text();
      console.error(`[Email Service] Failed to send email via Resend:`, errText);
      return false;
    }
  } catch (error) {
    console.error(`[Email Service Error]:`, error);
    return false;
  }
}
