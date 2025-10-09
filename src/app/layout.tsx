import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
import { Providers } from "@/components/providers";

import TopbarRouter from "./_components/TopbarRouter";
import FooterRouter from "./_components/FooterRouter";

export const metadata: Metadata = {
  title: "Calme - Your Mental Health Is Our Priority",
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
        {/* <KindeProvider> */}
          <Providers>
            <TopbarRouter />
            <main className="flex-grow">
              {children}
            </main>
            <FooterRouter />
          </Providers>
        {/* </KindeProvider> */}
      </body>
    </html>
  );
}
