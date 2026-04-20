import { Space_Grotesk, Archivo_Black } from "next/font/google";
import "./globals.css";
import GlobalEffects from './components/GlobalEffects';
import ConsoleWatermark from './components/ConsoleWatermark';
import Providers from './providers';
import NextTopLoader from 'nextjs-toploader';
import NotificationPrompt from '@/components/ui/NotificationPrompt';

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
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
    "Platform digital untuk download game gratis, tutorial teknologi, dan tips santai sehari-hari. Santuy, jelas, anti ribet.",
  keywords: [
    "Teknologi Santuy",
    "Download Game Gratis",
    "Tutorial IT",
    "Tips Gadget",
    "Forum Game Indonesia",
  ],
  authors: [{ name: "Fikri Alfarizi" }],
  creator: "Fikri Alfarizi",
  icons: {
    icon: [
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.ico", sizes: "any" },
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
      "Platform digital untuk download game gratis, tutorial teknologi, dan tips santai sehari-hari.",
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
      "Platform digital untuk download game gratis, tutorial teknologi, dan tips santai sehari-hari.",
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
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-8353833570794153" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body className={`${spaceGrotesk.variable} ${archivoBlack.variable} antialiased`} suppressHydrationWarning>
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
