import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-shadow hover:shadow-[0_10px_30px_-14px_rgb(var(--shadow-color)/0.35)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-border bg-paper">
        {project.coverType === "browser" ? (
          <div className="flex h-full w-full flex-col">
            <div className="flex items-center gap-1.5 border-b border-border bg-paper px-3.5 py-2">
              <span className="h-2 w-2 rounded-full bg-border-strong" />
              <span className="h-2 w-2 rounded-full bg-border-strong" />
              <span className="h-2 w-2 rounded-full bg-brass/60" />
            </div>
            <div className="relative flex-1">
              <Image
                src={project.image}
                alt={`${project.title} interface preview`}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
          </div>
        ) : (
          <Image
            src={project.image}
            alt={`${project.title} mockup preview`}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brass">
          {project.role} · {project.category}
        </p>
        <h3 className="font-serif text-xl text-ink">{project.title}</h3>
        <p className="text-sm leading-relaxed text-ink-secondary">
          {project.description}
        </p>
        <span className="mt-auto pt-3 text-sm font-semibold text-accent group-hover:underline">
          View case study →
        </span>
      </div>
    </Link>
  );
}
