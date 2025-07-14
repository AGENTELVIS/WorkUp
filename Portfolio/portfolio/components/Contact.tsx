"use client";

import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const { error } = await supabase.from("messages").insert([formData]);

    if (error) {
      console.error("Insert error:", error.message);
      setStatus("error");
    } else {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <section id="contact" className="py-16 px-6 dark:bg-black dark:text-white transition-colors duration-300 min-h-screen">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
        <p className="mb-10 text-[var(--foreground)]/70 dark:text-[var(--foreground)]/80">
          Feel free to reach out if you'd like to work together or have a question!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              type="text"
              required
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border-2 border-gray-300 dark:border-neutral-900 transition-colors duration-300 focus:border-indigo-400 focus:outline-0"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border-2 border-gray-300 dark:border-neutral-900 transition-colors duration-300 focus:border-indigo-400 focus:outline-0"
            />
          </div>

          <textarea
            name="message"
            required
            placeholder="Your Message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border-2 border-gray-300 dark:border-neutral-900 transition-colors duration-300 focus:border-indigo-400 focus:outline-0"
          ></textarea>

          <button
            type="submit"
            disabled={status === "sending"}
            className="bg-black  text-white dark:border-2 dark:border-neutral-900 px-6 py-3 rounded-full shadow-md hover:scale-[1.02] cursor-pointer transition-colors duration-300"
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>

          {status === "success" && <p className="text-indigo-200 mt-4">Message sent successfully!</p>}
          {status === "error" && <p className="text-red-500 mt-4">Something went wrong. Try again.</p>}
        </form>
      </div>
    </section>
  );
}
