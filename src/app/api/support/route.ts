import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { sendCustomerInquiryNotification } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Store inquiry in database
    db.prepare(`
      INSERT INTO inquiries (id, name, email, subject, message, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name, email, subject, message, createdAt);

    // Dispatch email notification to company owner (msgtorahul@gmail.com)
    sendCustomerInquiryNotification(name, email, subject, message).catch((e) => console.error('Support email dispatch error:', e));

    return NextResponse.json({ message: 'Thank you! Your message has been received and our team will get back to you shortly.' }, { status: 201 });
  } catch (error) {
    console.error('Support API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while submitting your message' }, { status: 500 });
  }
}
