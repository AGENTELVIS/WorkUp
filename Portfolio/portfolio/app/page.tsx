import Hero from "@/components/Hero";
import About from "@/components/About";
import Contact from "@/components/Contact";
import ProjectsSection from "@/components/ProjectsSection";


export default function Home() {
  return (
    <main className="scroll-smooth">
      <section id="hero" className=""><Hero /></section>
      <section id="about"><About /></section>
      <section id="projects"><ProjectsSection /></section>
      <section id="contact" className=""><Contact /></section>

    </main>
  );
}
