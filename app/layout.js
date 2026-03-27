import { Space_Grotesk, Archivo_Black } from "next/font/google";
import "./globals.css";
import GlobalEffects from './components/GlobalEffects';
import Providers from './providers';
import NextTopLoader from 'nextjs-toploader';

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
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Teknologi Santuy Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teknologi Santuy - Game Gratis & Tutorial IT",
    description:
      "Platform digital untuk download game gratis, tutorial teknologi, dan tips santai sehari-hari.",
    images: ["/logo.png"],
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
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${archivoBlack.variable} antialiased`} suppressHydrationWarning>
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
