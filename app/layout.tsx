import type { Metadata } from "next";
import { Mona_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const MonaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

const JetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Intervo",
  description: "AI Powered Mock Interviews, Get grilled by a robot so real.",
  icons: {
    icon: "/favicon.svg",         
    shortcut: "/favicon.png",     
    apple: "/apple-touch-icon.png" 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${MonaSans.variable} ${JetBrainsMono.variable} antialiased`}
      >
        {children}

        <Toaster/>
      </body>
    </html>
  );
}
