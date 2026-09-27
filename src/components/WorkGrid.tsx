import Kicker from "@/components/Kicker";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function WorkGrid() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <Kicker>Selected Work</Kicker>
      <h2 className="mb-10 max-w-2xl font-serif text-3xl text-ink sm:text-4xl">
        Eight projects, from a live product I run end to end to team case
        studies in enterprise, edtech, and e-commerce.
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
