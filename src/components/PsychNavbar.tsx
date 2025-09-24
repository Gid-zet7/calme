"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PsychNavbar() {
  const router = useRouter();

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/psychologist" className="font-semibold text-primary">
            Psychologist
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/psychologist" className="hover:text-foreground">Dashboard</Link>
            <Link href="/psychologist/appointments" className="hover:text-foreground">Appointments</Link>
            <Link href="/psychologist/clients" className="hover:text-foreground">Clients</Link>
            <Link href="/psychologist/notes" className="hover:text-foreground">Notes</Link>
            <Link href="/psychologist/settings" className="hover:text-foreground">Settings</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/api/auth/logout")}>Sign out</Button>
        </div>
      </div>
    </header>
  );
}


