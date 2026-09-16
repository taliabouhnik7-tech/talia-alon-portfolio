import Kicker from "@/components/Kicker";
import PlaceholderImage from "@/components/PlaceholderImage";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function WorkGrid() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <Kicker>Selected Work</Kicker>
      <h2 className="mb-10 max-w-2xl font-serif text-3xl text-ink sm:text-4xl">
        Eight projects, from a solo product I run end to end to team case
        studies in enterprise, edtech, and e-commerce.
      </h2>

      <a
        href="#bakery-case-study"
        className="group mb-6 grid overflow-hidden rounded-sm border border-border-strong bg-card transition-shadow hover:shadow-[0_16px_40px_-18px_rgb(var(--shadow-color)/0.4)] sm:grid-cols-2"
      >
        <PlaceholderImage
          label="Screenshot pending"
          className="aspect-[4/3] border-b-0 border-r-0 sm:aspect-auto sm:h-full sm:border-r sm:border-r-border"
        />
        <div className="flex flex-col justify-center gap-3 p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brass">
            Flagship · Solo · Live product
          </p>
          <h3 className="font-serif text-2xl text-ink sm:text-3xl">
            Talia Alon Bakery — ordering site &amp; admin system
          </h3>
          <p className="text-sm leading-relaxed text-ink-secondary sm:text-base">
            An end-to-end ordering flow and admin dashboard I designed and
            directed into a live, deployed product — from first wireframe to
            the shade of a hover state.
          </p>
          <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:underline">
            Read the case study →
          </span>
        </div>
      </a>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
