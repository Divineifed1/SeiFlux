import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Set the SendGrid API key from environment variables
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY is not set. Email sending will be disabled.');
}

/**
 * Handles POST requests to send an email.
 * Expects a JSON body with:
 * @param {string} to - The recipient's email address.
 * @param {string} from - The sender's email address (must be a verified sender in SendGrid).
 * @param {string} subject - The subject of the email.
 * @param {string} text - The plain text content of the email.
 * @param {string} html - The HTML content of the email.
 */
export async function POST(req: NextRequest) {
  // Ensure the API key is set before trying to send an email
  if (!process.env.SENDGRID_API_KEY) {
    return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { to, from, subject, text, html } = body;

    // Basic validation
    if (!to || !from || !subject || (!text && !html)) {
      return NextResponse.json({ error: 'Missing required email fields.' }, { status: 400 });
    }

    const msg = {
      to,
      from,
      subject,
      text,
      html,
    };

    await sgMail.send(msg);

    return NextResponse.json({ message: 'Email sent successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    // It's good practice to check for SendGrid-specific errors
    if (error.response) {
      console.error(error.response.body)
    }
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}