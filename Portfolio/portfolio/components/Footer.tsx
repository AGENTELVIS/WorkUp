import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className=" dark:bg-black dark:text-white px-6 py-10 border-t border-indigo-700 dark:border-indigo-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
        {/* Social Links */}
        <div className="flex gap-6 text-2xl">
          <a
            href="https://github.com/AGENTELVIS"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 transition-colors duration-200"
            aria-label="GitHub"
          >
            <Github />
          </a>
          <a
            href="https://www.linkedin.com/in/pawan-yadav-b2679a255"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <Linkedin />
          </a>
          <a
            href="mailto:py30455@gmail.com"
            className="hover:text-indigo-600 transition-colors duration-200"
            aria-label="Email"
          >
            <Mail />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Pawan Yadav. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
