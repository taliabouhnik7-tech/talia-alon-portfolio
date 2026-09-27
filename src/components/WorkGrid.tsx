import Kicker from "@/components/Kicker";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import { projects } from "@/data/projects";

export default function WorkGrid() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <Reveal>
        <Kicker>Selected Work</Kicker>
        <h2 className="mb-10 max-w-2xl font-serif text-3xl text-ink sm:text-4xl">
          Eight projects, from a live product I run end to end to team case
          studies in enterprise, edtech, and e-commerce.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 3) * 0.08}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
