//navbar 1 with glass effect no hiding when scrolling

"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { User, FolderOpen, Mail } from "lucide-react";

const navLinks = [
  { name: "About", href: "#about", icon: <User size={20} /> },
  { name: "Projects", href: "#projects", icon: <FolderOpen size={20} /> },
  { name: "Contact", href: "#contact", icon: <Mail size={20} /> },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  setCursorPos({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  });
};

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500">
        <div
          className="border-b-indigo-700 border-b-3 relative w-[90vw] max-w-[650px] px-6 py-2 rounded-4xl shadow-lg  bg-black dark:bg-black/10 backdrop-blur-md text-white dark:text-white transition-colors duration-300 flex items-center justify-between"
        >
          {/* Logo */}
          <a href="#hero" className="text-lg font-semibold">
            Pawan
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative group transition-colors duration-300"
              >
                {link.name}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-indigo-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
              </a>
            ))}
          </div>

          {/* Mobile Icons */}
          <div className="md:hidden flex gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-black/10 transition"
                title={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Theme Toggle (Positioned Differently per Screen Size) */}
      <div
        className={`fixed z-50 transition-opacity duration-300 ${
          showNavbar ? "opacity-100" : "opacity-0 pointer-events-none"
        } top-5 right-4 md:top-5 md:right-3 md:block lg:right-14 hidden`}
      >
        <ThemeToggle />
      </div>

      <div className="fixed bottom-5 right-5 z-50 md:hidden">
        <ThemeToggle />
      </div>
    </>
  );
}
