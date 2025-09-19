'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  RegisterLink,
  LoginLink,
  LogoutLink
} from "@kinde-oss/kinde-auth-nextjs/components";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated } = useKindeBrowserClient();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/programs", label: "Programs" },
    { path: "/resources", label: "Resources" },
    { path: "/news", label: "News" },
    // { path: "/book-appointment", label: "Book Appointment" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2"
          onClick={closeMenu}
        >
          <Heart className="w-8 h-8 text-primary-600" />

          <span className="text-2xl font-bold text-primary-700">Calme</span>
          {/* Uncomment the line below to include the logo image  */}
          {/* <img
            src={CalmeLogo}
            alt="Cal-me Logo"
            className="w-8 h-8 object-contain"
          /> */}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`font-medium hover:text-primary-600 transition-colors ${
                pathname === link.path
                  ? "text-primary-600"
                  : "text-neutral-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link href="/book-appointment" className="btn-primary">
                Book Appointment
              </Link>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span className="text-sm">{user?.given_name || user?.email}</span>
                <LogoutLink className="text-neutral-700 hover:text-primary-600 transition-colors">
                  <LogOut className="w-5 h-5" />
                </LogoutLink>
              </div>
            </div>
          ) : (
            <LoginLink className="btn-primary">
              Sign In
            </LoginLink>
          )}
        </div>

        {/* Mobile Navigation Button */}
        <button
          className="md:hidden text-neutral-700 focus:outline-none"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg overflow-hidden"
          >
            <div className="container py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`font-medium hover:text-primary-600 transition-colors px-4 py-2 rounded-md ${
                    pathname === link.path
                      ? "text-primary-600 bg-primary-50"
                      : "text-neutral-700"
                  }`}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/book-appointment"
                    className="btn-primary mx-4"
                    onClick={closeMenu}
                  >
                    Book Appointment
                  </Link>
                  <div className="mx-4 py-2 border-t border-neutral-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">{user?.given_name || user?.email}</span>
                    </div>
                    <LogoutLink 
                      className="flex items-center space-x-2 text-neutral-700 hover:text-primary-600 transition-colors"
                      onClick={closeMenu}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </LogoutLink>
                  </div>
                </>
              ) : (
                <RegisterLink 
                  className="btn-primary mx-4"
                  onClick={closeMenu}
                >
                  Sign Up
                </RegisterLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
