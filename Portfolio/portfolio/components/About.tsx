"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section
      id="about"
      className="min-h-screen flex flex-col justify-center items-center px-6 py-16 dark:bg-black dark:text-white transition-colors duration-300"
    >
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl font-bold mb-6 text-center"
      >
        About Me
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
        className="text-lg sm:text-xl max-w-3xl text-center leading-relaxed"
      >
        I recently completed my <span className="font-semibold text-indigo-500">Bachelor's degree in Computer Applications (BCA)</span>,
        during which I explored full-stack development and built hands-on projects. I am passionate about clean user interfaces, performance,
        and solving real-world problems with code. Currently, I am seeking an <span className="font-semibold">internship</span> or
        <span className="font-semibold"> entry-level opportunity</span> where I can contribute, learn, and grow as a developer.
      </motion.p>
    </section>
  );
}
