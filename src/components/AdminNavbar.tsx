"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DropdownMenuUser } from "@/components/dropdown-menu";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function AdminNavbar() {
  const router = useRouter();
  const user = useKindeBrowserClient().getUser();
  console.log(user)

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="font-semibold text-primary">
            Admin
          </Link>
         
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenuUser user={user} />
        </div>
      </div>
    </header>
  );
}


