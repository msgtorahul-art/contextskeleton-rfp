import nodemailer from 'nodemailer';

// Create Hostinger / Custom SMTP Transporter
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendWelcomeEmail(email: string): Promise<boolean> {
  const subject = "Welcome to ContextSkeleton - 10 Free Proposal & Building Audit Credits! 🚀";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #090b11; color: #f8fafc; padding: 30px; border-radius: 16px; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #a855f7; font-size: 28px; margin: 0;">ContextSkeleton</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Unified B2B RFP & AI Building Consent Platform</p>
      </div>

      <h2 style="color: #ffffff; font-size: 20px;">Welcome aboard!</h2>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
        Your account is active with <strong>10 Free Platform Credits</strong>.
      </p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://contextskeleton.com/dashboard" style="background-color: #7c3aed; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 24px; border-radius: 10px; display: inline-block;">
          Go to Dashboard &rarr;
        </a>
      </div>
    </div>
  `;

  return deliverEmail(email, subject, html);
}

export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  const subject = `Verify Your Email Code: ${code} - ContextSkeleton`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background-color: #090b11; color: #f8fafc; padding: 30px; border-radius: 16px; border: 1px solid #1e293b;">
      <h2 style="color: #a855f7; font-size: 22px; margin-top: 0;">Email Verification Required</h2>
      <p style="color: #cbd5e1; font-size: 14px;">Please use the 6-digit verification code below to complete your registration:</p>
      <div style="background-color: #1e1b4b; color: #a855f7; font-size: 32px; font-weight: bold; letter-spacing: 6px; text-align: center; padding: 16px; border-radius: 12px; margin: 20px 0;">
        ${code}
      </div>
      <p style="color: #94a3b8; font-size: 12px;">Or click the link below to verify automatically:</p>
      <div style="text-align: center; margin-top: 16px;">
        <a href="https://contextskeleton.com/auth?mode=verify&code=${code}&email=${encodeURIComponent(email)}" style="background-color: #7c3aed; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13px; padding: 10px 20px; border-radius: 8px; display: inline-block;">
          Verify Email Now &rarr;
        </a>
      </div>
    </div>
  `;

  return deliverEmail(email, subject, html);
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const subject = "Reset Your Password - ContextSkeleton";
  const resetUrl = `https://contextskeleton.com/auth?mode=reset&token=${token}&email=${encodeURIComponent(email)}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background-color: #090b11; color: #f8fafc; padding: 30px; border-radius: 16px; border: 1px solid #1e293b;">
      <h2 style="color: #38bdf8; font-size: 22px; margin-top: 0;">Password Reset Request</h2>
      <p style="color: #cbd5e1; font-size: 14px;">We received a request to reset your password for ContextSkeleton.</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${resetUrl}" style="background-color: #0284c7; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 24px; border-radius: 10px; display: inline-block;">
          Reset My Password &rarr;
        </a>
      </div>
      <p style="color: #64748b; font-size: 11px;">If you did not request a password reset, please ignore this email.</p>
    </div>
  `;

  return deliverEmail(email, subject, html);
}

export async function sendCustomerInquiryNotification(name: string, email: string, subject: string, message: string): Promise<boolean> {
  const companySupportEmail = process.env.NOTIFICATION_EMAIL || "support@contextskeleton.com";
  const emailSubject = `[Customer Inquiry / Complaint] ${subject} from ${name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #090b11; color: #f8fafc; padding: 30px; border-radius: 16px; border: 1px solid #1e293b;">
      <h2 style="color: #f43f5e; font-size: 20px; margin-top: 0;">New Customer Inquiry / Complaint Received</h2>
      <p style="color: #cbd5e1; font-size: 13px;"><strong>From:</strong> ${name} (&lt;${email}&gt;)</p>
      <p style="color: #cbd5e1; font-size: 13px;"><strong>Subject:</strong> ${subject}</p>
      <div style="background-color: #0f172a; padding: 16px; border-radius: 10px; border: 1px solid #334155; color: #f8fafc; font-size: 14px; line-height: 1.6; margin: 16px 0;">
        ${message.replace(/\n/g, '<br/>')}
      </div>
      <p style="color: #94a3b8; font-size: 12px;">Reply directly to this email to contact the customer.</p>
    </div>
  `;

  return deliverEmail(companySupportEmail, emailSubject, html);
}

async function deliverEmail(to: string, subject: string, html: string): Promise<boolean> {
  const transporter = getTransporter();
  const fromEmail = process.env.SMTP_USER || 'support@contextskeleton.com';

  if (!transporter) {
    console.warn(`[Email Service Warning] SMTP credentials (SMTP_USER/SMTP_PASS) not configured. Email to ${to} subject "${subject}" was not sent.`);
    return false; // Honest status: Returns false when SMTP transport is unconfigured
  }

  try {
    await transporter.sendMail({
      from: `ContextSkeleton <${fromEmail}>`,
      to,
      subject,
      html,
    });
    console.log(`[Hostinger SMTP] Email delivered successfully to ${to}`);
    return true;
  } catch (error) {
    console.error(`[Hostinger SMTP Error]:`, error);
    return false;
  }
}
