import Image from "next/image";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-shadow hover:shadow-[0_10px_30px_-14px_rgb(var(--shadow-color)/0.35)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-border bg-paper">
        <Image
          src={project.image}
          alt={`${project.title} interface preview`}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brass">
          {project.role} · {project.category}
        </p>
        <h3 className="font-serif text-xl text-ink">{project.title}</h3>
        <p className="text-sm leading-relaxed text-ink-secondary">
          {project.description}
        </p>
        <p className="mt-auto pt-3 text-xs font-medium uppercase tracking-[0.1em] text-ink-secondary/70">
          Case study coming soon
        </p>
      </div>
    </article>
  );
}
