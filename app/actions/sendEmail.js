'use server';
import nodemailer from 'nodemailer';

/**
 * Server Action to handle contact form submission via Nodemailer.
 * Sends an email to the site owner using SMTP credentials from environment variables.
 * @param {FormData} formData - The submitted form data.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendEmail(formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const subject = formData.get('subject');
  const message = formData.get('message');

  // Verify SMTP credentials
  if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
    console.error("SMTP Credentials missing in .env.local");
    return { 
      success: false, 
      error: "Konfigurasi email (SMTP) belum diatur di .env.local. Gunakan App Password jika memakai Gmail." 
    };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_SERVER_PORT || '465'),
    secure: (process.env.EMAIL_SERVER_PORT || '465') === '465',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_SERVER_USER}>`,
      to: "fikrialfarizi038@gmail.com",
      replyTo: email,
      subject: `[Kontak TS] ${subject} - ${name}`,
      text: message,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; border: 4px solid #000; background: #fff; max-width: 600px; box-shadow: 10px 10px 0 #000;">
          <h2 style="color: #000; background: #ffe600; padding: 15px; display: inline-block; border: 3px solid #000; text-transform: uppercase; font-weight: 950; margin-top: 0; letter-spacing: -0.5px;">
            Pesan Baru - Teknologi Santuy
          </h2>
          <div style="margin: 20px 0; font-size: 16px; color: #000;">
            <p style="margin: 8px 0;"><strong>👤 Pengirim:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong>📧 Email:</strong> ${email}</p>
            <p style="margin: 8px 0;"><strong>📌 Subjek:</strong> ${subject}</p>
          </div>
          <hr style="border: 2px solid #000; margin: 25px 0;" />
          <div style="padding: 20px; background: #f4f4f4; border: 2px solid #000; font-size: 15px; line-height: 1.6; color: #333; white-space: pre-wrap;">
            ${message}
          </div>
          <p style="margin-top: 30px; font-size: 11px; color: #888; text-align: center; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
            © 2026 Teknologi Santuy - Official Notification
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Nodemailer Error Details:", error);
    return { 
      success: false, 
      error: "Gagal mengirim email (SMTP Error). Pastikan Host, Port, dan App Password sudah benar." 
    };
  }
}
