"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function FooterRouter() {
  const pathname = usePathname() || "";
  console.log(pathname);

  if (pathname.startsWith("/admin") || pathname.startsWith("/psychologist")) {
    return null;
  }

  return <Footer />;
}


