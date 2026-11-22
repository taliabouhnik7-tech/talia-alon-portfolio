import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const live = project.category === "Live product";

  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[10px] bg-canvas ring-1 ring-rule transition-shadow duration-200 group-hover:ring-2 group-hover:ring-select">
        <Image
          src={project.image}
          alt={`${project.title} cover`}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        {live && (
          <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[13px] font-medium text-graphite backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2f9e5b]" />
            Live
          </span>
        )}
      </div>
      <h3 className="mt-4 text-[19px] leading-tight font-semibold tracking-[-0.015em] text-graphite group-hover:text-select">
        {project.title}
      </h3>
      <p className="mt-1 text-[15px] text-graphite-soft">
        {project.category}, {project.role === "Solo" ? "solo" : "team"}
      </p>
      <p className="mt-2 text-[15px] leading-[1.5] text-graphite-soft">{project.description}</p>
    </Link>
  );
}
