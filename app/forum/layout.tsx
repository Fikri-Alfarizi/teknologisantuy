import { Metadata } from "next";
import { Providers } from "./providers";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Teknologi Santuy Forum",
  description: "Platform diskusi Teknologi Santuy",
};

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={openSans.variable}>
      <Providers>{children}</Providers>
    </div>
  );
}
