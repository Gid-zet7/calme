"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import AdminNavbar from "@/components/AdminNavbar";
import PsychNavbar from "@/components/PsychNavbar";

export default function TopbarRouter() {
  const pathname = usePathname() || "";

  if (pathname.startsWith("/admin")) {
    return <AdminNavbar />;
  }

  if (pathname.startsWith("/psychologist")) {
    return <PsychNavbar />;
  }

  return <Navbar />;
}


