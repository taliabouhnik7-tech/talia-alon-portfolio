import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[10px] bg-canvas ring-1 ring-rule transition-shadow duration-200 group-hover:ring-2 group-hover:ring-select">
        <Image
          src={project.image}
          alt={`${project.title} cover`}
          fill
          sizes={large ? "(min-width: 640px) 45vw, 92vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"}
          className="object-cover"
        />
      </div>
      <h3 className={`mt-4 ${large ? "text-[24px]" : "text-[19px]"} leading-tight font-semibold tracking-[-0.015em] text-graphite group-hover:text-select`}>
        {project.title}
      </h3>
      <p className="mt-1 text-[15px] text-graphite-soft">
        {project.category}, {project.role === "Solo" ? "solo" : "team"}
      </p>
      <p className="mt-2 text-[15px] leading-[1.5] text-graphite-soft">{project.description}</p>
    </Link>
  );
}
