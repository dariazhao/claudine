import type { Metadata } from "next";
import { Nunito, Lora } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  style: ["normal", "italic"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://claudine-three.vercel.app"),
  title: "Claudine — Daily Check-in",
  description: "A warm daily check-in for the people you love most. Invite-only · takes 2 minutes a day.",
  icons: {
    icon: [{ url: "/bears/png/joyful.png" }],
    apple: [{ url: "/bears/png/joyful.png" }],
  },
  openGraph: {
    title: "Claudine — Daily Check-in",
    description: "A warm daily check-in for the people you love most.",
    url: "https://claudine-three.vercel.app",
    siteName: "Claudine",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claudine — Daily Check-in",
    description: "A warm daily check-in for the people you love most.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${lora.variable} font-sans antialiased bg-cream-50 text-[#3d2b1f]`}
      >
        {children}
      </body>
    </html>
  );
}
