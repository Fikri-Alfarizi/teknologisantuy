import { Space_Grotesk, Archivo_Black, Inter, Manrope } from "next/font/google";
import "./globals.css";
import GlobalEffects from './components/GlobalEffects';
import ConsoleWatermark from './components/ConsoleWatermark';
import Providers from './providers';
import NextTopLoader from 'nextjs-toploader';
import NotificationPrompt from '@/components/ui/NotificationPrompt';
import Script from 'next/script';

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: 'swap',
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
  display: 'swap',
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL("https://teknologisantuy.vercel.app"),
  title: {
    default: "Teknologi Santuy - Game Gratis & Tutorial IT",
    template: "%s | Teknologi Santuy",
  },
  verification: {
    google: "I3zt-MSPUmdjSsmJ-p0XwobSX-Jf0vefeOnF-_Hk3-c",
  },
  description:
    "Teknologi Santuy adalah platform digital terlengkap untuk download game gratis, tutorial IT, tips gadget terbaru, dan panduan teknologi anti ribet. Nikmati ribuan konten menarik yang diperbarui setiap hari untuk komunitas gaming Indonesia.",
  keywords: [
    "Teknologi Santuy",
    "Download Game Gratis",
    "Tutorial IT",
    "Tips Gadget",
    "Forum Game Indonesia",
    "Game PC Ringan",
    "Emulator Android",
  ],
  alternates: {
    canonical: "https://teknologisantuy.vercel.app",
  },
  authors: [{ name: "Fikri Alfarizi" }],
  creator: "Fikri Alfarizi",
  icons: {
    icon: [
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon/favicon.ico" }],
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://teknologisantuy.vercel.app",
    title: "Teknologi Santuy - Game Gratis & Tutorial IT",
    description:
      "Platform digital terlengkap untuk download game gratis, tutorial IT, dan tips gadget harian. Santuy, jelas, anti ribet.",
    siteName: "Teknologi Santuy",
    images: [
      {
        url: "https://i.ibb.co.com/4kbmQSZ/TEKNologi-santuy.png",
        width: 1200,
        height: 630,
        alt: "Teknologi Santuy Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teknologi Santuy - Game Gratis & Tutorial IT",
    description:
      "Platform digital terlengkap untuk download game gratis, tutorial IT, dan tips gadget harian. Santuy, jelas, anti ribet.",
    images: ["https://i.ibb.co.com/4kbmQSZ/TEKNologi-santuy.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Teknologi Santuy",
    "url": "https://teknologisantuy.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://teknologisantuy.vercel.app/blog?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "description": "Platform digital untuk download game gratis, tutorial teknologi, dan tips santai sehari-hari."
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-8353833570794153" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Material Symbols - use display swap to avoid layout shift and blocking */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body className={`${spaceGrotesk.variable} ${archivoBlack.variable} ${inter.variable} ${manrope.variable} antialiased`} suppressHydrationWarning>
        {/* Global Watermark Branding */}
        <ConsoleWatermark />

        <NextTopLoader
          color="var(--yellow)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={4}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px var(--yellow),0 0 5px var(--yellow)"
          zIndex={1600}
          showAtBottom={false}
        />
        <Providers>
          <GlobalEffects />
          <NotificationPrompt />
          {children}
        </Providers>


      </body>
    </html>
  );
}
