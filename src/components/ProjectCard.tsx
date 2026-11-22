import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/projects";

export default function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const fit = project.imageFit ?? "contain";

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group grid gap-5 ${featured ? "lg:grid-cols-[1.5fr_1fr] lg:items-center lg:gap-12" : ""}`}
    >
      <div
        className={`relative w-full overflow-hidden rounded-[10px] bg-frame ring-1 ring-rule transition-[box-shadow] duration-200 group-hover:ring-2 group-hover:ring-select ${
          featured ? "aspect-[16/10]" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={project.image}
          alt={`${project.title} cover`}
          fill
          sizes={featured ? "(min-width: 1024px) 60vw, 92vw" : "(min-width: 768px) 45vw, 92vw"}
          className={fit === "cover" ? "object-cover" : "object-contain p-5"}
        />
      </div>
      <div>
        <p className="text-[15px] text-graphite-soft">
          {project.category}
          <span className="text-rule"> / </span>
          {project.role === "Solo" ? "Solo project" : "Team project"}
        </p>
        <h3
          className={`mt-1.5 font-semibold tracking-[-0.02em] text-graphite group-hover:text-select ${
            featured ? "text-[32px] leading-[1.1] sm:text-[40px]" : "text-[22px] leading-tight"
          }`}
        >
          {project.title}
        </h3>
        <p className={`mt-2.5 max-w-[52ch] leading-[1.55] text-graphite-soft ${featured ? "text-lg" : "text-[16px]"}`}>
          {project.description}
        </p>
        {featured && (
          <span className="mt-6 inline-block rounded-full bg-graphite px-5 py-2.5 text-[15px] font-medium text-white">
            Read the case study
          </span>
        )}
      </div>
    </Link>
  );
}
