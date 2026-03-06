import { NextRequest, NextResponse } from "next/server";
import { insertContactSubmission } from "@/lib/db";
import { sendContactNotificationEmail } from "@/lib/sendgrid";

const SUBJECTS = ["event-styling", "balloons", "general"] as const;

/**
 * POST /api/contact
 * Store contact form submission and email Nicole.
 */
export async function POST(request: NextRequest) {
  let body: { name?: string; email?: string; subject?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > 200) {
    return NextResponse.json({ error: "Please provide your name." }, { status: 400 });
  }
  if (!email || email.length > 320) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (!SUBJECTS.includes(subject as (typeof SUBJECTS)[number])) {
    return NextResponse.json({ error: "Please select a subject." }, { status: 400 });
  }
  if (!message || message.length > 10000) {
    return NextResponse.json({ error: "Please enter a message." }, { status: 400 });
  }

  const dbUrl = process.env.DATABASE_URL || process.env.STORAGE_DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json(
      { error: "Contact form is not configured. Please try again later." },
      { status: 503 }
    );
  }

  try {
    await insertContactSubmission({ name, email, subject, message });
  } catch (err) {
    console.error("Contact form: failed to store submission", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  try {
    await sendContactNotificationEmail({ name, email, subject, message });
  } catch (err) {
    console.error("Contact form: failed to send notification email", err);
    // Submission is already stored; still return 200 so user sees success
    return NextResponse.json({ ok: true, emailSent: false });
  }

  return NextResponse.json({ ok: true });
}
