"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Hero() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <section
      id="hero"
      className="min-h-screen text-indigo-500 flex flex-col justify-center items-center text-center px-6  dark:bg-black transition-colors duration-300"
    >
      {/* Animated Greeting */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl md:text-6xl font-bold"
      >
        Hi, I'm <span className="text-indigo-500">Pawan</span>
      </motion.h1>

      {/* Animated Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-4 text-lg sm:text-xl max-w-xl text-black dark:text-white"
      >
        I'm a full-stack developer who loves building clean and interactive web apps using React and Next.js.
      </motion.p>

      {/* Animated Button */}
      <motion.a
        href="#projects"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-10 text-md dark:border-2  dark:border-neutral-900 inline-block px-6 py-3 rounded-full bg-black text-white dark:text-white dark:bg-black font-normal hover:transition"
      >
        View My Work
      </motion.a>
    </section>
  );
}
