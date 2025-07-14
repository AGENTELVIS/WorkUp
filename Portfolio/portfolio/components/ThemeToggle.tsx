"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-10 w-10 hover:scale-110 cursor-pointer items-center self-center justify-center p-2 rounded-full bg-indigo-500/10 dark:bg-white/10 hover:bg-indigo-500/30 dark:hover:bg-white/20 transition duration-300 backdrop-blur-md dark:text-white"
    >
      <Sun className={`items-center self-center justify-center h-5 w-5 transition-all absolute ${isDark ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} />
      <Moon className={`items-center self-center justify-center h-5 w-5 transition-all ${isDark ? "opacity-0 scale-0" : "opacity-100 scale-100"}`} />
    </button>
  );
}
