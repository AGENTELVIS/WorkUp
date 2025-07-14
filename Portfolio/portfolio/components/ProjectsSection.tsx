"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { projects } from "./Projects";
import { SquareArrowOutUpRight, SquareArrowUpRight } from "lucide-react";
import { techIconMap } from "./TechIcons";

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="min-h-screen py-16 px-6 dark:bg-black transition-colors duration-300"
    >
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl font-bold mb-12 text-center"
      >
        My Projects
      </motion.h2>

      <div className="grid gap-10 md:grid-cols-2 max-w-4xl mx-auto place-items-center">
        {projects.map((project, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full bg-white dark:bg-black border-2 border-neutral-900 rounded-xl p-6 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white ">
              {project.name}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 ">
              {project.description}
            </p>
            <div className="flex flex-wrap py-2 justify gap-4 mb-4">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="relative group"
                >
                  {techIconMap[tech] || (
                    <span className="text-xs text-gray-500">{tech}</span>
                  )}
                  <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1 w-max px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                    {tech}
                  </span>
                </span>
              ))}
            </div>
            <div className="flex justify-between gap-4">
              {project.github && (
                <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex px-1 py-2 text-md gap-1 text-indigo-600 rounded hover:underline underline-offset-4 transition"
              >
                View Code
                <SquareArrowOutUpRight size={16} className="self-center"/>
              </a>
              )}
              {project.live && (
                <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-1 px-4 py-2 text-md text-green-500 rounded-full  hover:underline underline-offset-4 transition"
              >
                Live Demo
                <SquareArrowOutUpRight size={16} className="self-center"/>
                
              </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}