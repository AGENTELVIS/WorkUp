import { JSX } from "react";
import { FaReact, FaGithub, FaNodeJs } from "react-icons/fa";
import { SiTailwindcss, SiAppwrite, SiSupabase, SiNextdotjs} from "react-icons/si";
import { RiNextjsFill,RiNextjsLine } from 'react-icons/ri';

export const techIconMap: Record<string, JSX.Element> = {
  React: <FaReact className="text-blue-500 w-5 h-5" />,
  Tailwind: <SiTailwindcss className="text-teal-400 w-5 h-5" />,
  Appwrite: <SiAppwrite className="text-pink-500 w-5 h-5" />,
  Supabase: <SiSupabase className="text-green-500 w-5 h-5" />,
  Node: <FaNodeJs className="text-green-600 w-5 h-5" />,
  Nextjs: <RiNextjsFill className="w-5.5 h-5.5 "/>,
};
