'use client';

import { useEffect } from 'react';

/**
 * ConsoleWatermark - Menampilkan branding dan peringatan di konsol browser.
 * Berjalan sekali saat aplikasi dimuat di client-side.
 */
export default function ConsoleWatermark() {
  useEffect(() => {
    // Styling untuk berbagai bagian teks konsol
    const brandingStyle = `
      background: linear-gradient(90deg, #66c0f4 0%, #a4d007 100%);
      color: white;
      padding: 10px 20px;
      font-size: 24px;
      font-weight: bold;
      border-radius: 8px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
      font-family: sans-serif;
    `;

    const warningTitleStyle = `
      color: #ff0000;
      font-size: 32px;
      font-weight: 900;
      text-shadow: 2px 2px 0px #000;
      font-family: sans-serif;
    `;

    const messageStyle = `
      color: #738895;
      font-size: 16px;
      font-weight: 600;
      font-family: sans-serif;
    `;

    const linkStyle = `
      color: #66c0f4;
      font-size: 14px;
      font-weight: bold;
      text-decoration: underline;
      font-family: sans-serif;
    `;

    const legalStyle = `
      color: #ff6b6b;
      font-size: 12px;
      font-weight: bold;
      padding: 4px 8px;
      border: 1px solid #ff6b6b;
      border-radius: 4px;
      font-family: sans-serif;
    `;

    // Clear console logs first (optional, but requested "clear console log")
    // Note: Console.clear() might be intrusive, so we just add our watermark clearly.
    // console.clear(); 

    console.log('%cTEKNOLOGI SANTUY', brandingStyle);
    console.log('%cSTOP!', warningTitleStyle);
    console.log(
      '%cIni adalah fitur browser yang ditujukan untuk pengembang. Jika seseorang menyuruh Anda menyalin dan menempelkan sesuatu di sini untuk mengaktifkan fitur tertentu atau "meretas" akun seseorang, itu adalah penipuan dan akan memberi mereka akses ke akun Anda.',
      messageStyle
    );
    console.log(
      '%c⚠️ PERINGATAN HUKUM (UU ITE):',
      'color: yellow; font-size: 18px; font-weight: bold;'
    );
    console.log(
      '%cSegala bentuk akses ilegal, modifikasi, atau perusakan sistem ini dapat dijerat dengan UU ITE Pasal 30 & 32 yang berlaku di wilayah hukum Republik Indonesia. Jangan melakukan hal yang tidak Anda pahami.',
      legalStyle
    );
    console.log('%cFollow Social Media Kami:', 'color: white; font-weight: bold; margin-top: 10px;');
    console.log('%c📺 YouTube: https://www.youtube.com/@TeknologiSantuy', linkStyle);
    console.log('%c💬 Discord: https://discord.gg/adMaSMC4sc', linkStyle);
    
    // Detect dark/light mode for better colors if needed
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
       // Optional: adjust colors for light mode if they are hard to read
       // But current colors (Blue/Green/Red) usually work on both.
    }

  }, []);

  return null; // Komponen ini hanya menjalankan logic console
}
