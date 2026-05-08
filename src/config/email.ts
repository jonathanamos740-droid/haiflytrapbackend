import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Ensure the RESEND_API_KEY is available in the environment variables
const resend = new Resend(process.env.RESEND_API_KEY || '');

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    // Determine the from email to use, falling back to resend's test domain if not configured
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    const response = await resend.emails.send({
      from: `Haifly Trap <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    
    console.log('Email sent successfully via Resend', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    return { success: false, error };
  }
};
