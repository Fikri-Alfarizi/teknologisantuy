import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    // 1. Save to Firestore
    const docRef = await addDoc(collection(db, 'contact_messages'), {
      name,
      email,
      subject: subject || 'No Subject',
      message,
      timestamp: serverTimestamp(),
      status: 'unread'
    });

    // 2. Send Email
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '465'),
        secure: true, 
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });

      const mailOptions = {
        from: `"Teknologi Santuy Contact" <${process.env.EMAIL_SERVER_USER}>`,
        to: process.env.EMAIL_SERVER_USER, // Send to site owner
        replyTo: email,
        subject: `[Kontak Baru] ${subject || 'Pesan dari ' + name}`,
        text: `Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 4px solid #000; background: #fff;">
            <h2 style="text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 10px;">Pesan Kontak Baru</h2>
            <p><strong>Nama:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Perihal:</strong> ${subject || '-'}</p>
            <hr style="border: 2px solid #000;" />
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email Send Error:', emailError);
      // We don't return error here because we already saved to Firestore
    }

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
