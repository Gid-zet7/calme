import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cal-me - Your Mental Health Is Our Priority",
  description: "Calme provides accessible mental health resources, professional support, and community programs to help you navigate life's challenges and thrive.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <TRPCReactProvider>
          <main className="flex-grow pt-16">
            {children}
          </main>
        </TRPCReactProvider>
        <Footer />
      </body>
    </html>
  );
}
