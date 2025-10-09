'use client'
import React from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useUserRole } from "@/hooks/useUserRole";
import PillNav, { type PillNavItem } from "./PillNav";

const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useKindeBrowserClient();
  const { role } = useUserRole();

  // Define navigation items for PillNav
  // Only show "Sign in" if not authenticated, and give it a special className for custom bg
  const navItems: (PillNavItem & { className?: string })[] = [
    { label: "Home", href: "/", ariaLabel: "Go to homepage" },
    { label: "About", href: "/about", ariaLabel: "Learn about Calme" },
    { label: "Programs", href: "/programs", ariaLabel: "View our programs" },
    { label: "Resources", href: "/resources", ariaLabel: "Access resources" },
    { label: "News", href: "/news", ariaLabel: "Read latest news" },
    { label: "Contact", href: "/contact", ariaLabel: "Get in touch" },
    ...(!isAuthenticated
      ? [
          {
            label: "Sign in",
            href: "/api/auth/login",
            ariaLabel: "Sign in",
            className: "bg-blue-600 text-white hover:bg-blue-700", // Custom bg for sign in
          },
        ]
      : []),
    ...(isAuthenticated
      ? [
          {
            label: "Book Appointment",
            href: "/book-appointment",
            ariaLabel: "Book an appointment",
          },
          ...(role === "ADMIN"
            ? [
                {
                  label: "Admin Dashboard",
                  href: "/admin",
                  ariaLabel: "Access admin panel",
                },
              ]
            : []),
          ...(role === "PSYCHOLOGIST"
            ? [
                {
                  label: "My Dashboard",
                  href: "/psychologist",
                  ariaLabel: "Access psychologist dashboard",
                },
              ]
            : []),
        ]
      : []),
  ];

  return (
    <PillNav
      logo="/calme-logo.svg"
      logoAlt="Calme Logo"
      items={navItems}
      baseColor="#ffffff"
      pillColor="#000"
      hoveredPillTextColor="#000"
      pillTextColor="#ffffff"
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
      initialLoadAnimation={true}
      // Pass a prop to allow custom className per item (if PillNav supports it)
      itemClassNameKey="className"
    />
  );
};

export default Navbar;
