"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

const filters = [
  { id: "all", label: "All" },
  { id: "Solo", label: "Solo" },
  { id: "Team", label: "Team" },
] as const;

type FilterId = (typeof filters)[number]["id"];

export default function WorkGrid() {
  const [filter, setFilter] = useState<FilterId>("all");
  const list = filter === "all" ? projects : projects.filter((p) => p.role === filter);
  const [featured, ...rest] = list;
  const showFeatured = featured?.slug === "bakery";
  const grid = showFeatured ? rest : list;

  return (
    <section id="work" className="mx-auto w-full max-w-[1200px] scroll-mt-16 px-5 py-20 sm:px-8 sm:py-28">
      <div className="flex flex-col gap-6 border-b border-rule pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[40px] font-semibold leading-none tracking-[-0.03em] text-graphite sm:text-[56px]">
            Work
          </h2>
          <p className="mt-3 text-[17px] text-graphite-soft">
            {list.length} {list.length === 1 ? "project" : "projects"}. Solo work I led end to end, and team case studies.
          </p>
        </div>

        <div role="tablist" aria-label="Filter projects" className="inline-flex self-start rounded-full bg-[#d6d6d2] p-1 sm:self-auto">
          {filters.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-1.5 text-[15px] transition-colors ${
                filter === f.id ? "bg-frame font-medium text-graphite shadow-sm" : "text-graphite-soft hover:text-graphite"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {showFeatured && (
        <div className="mt-12">
          <ProjectCard project={featured} featured />
        </div>
      )}

      <div className={`grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 ${showFeatured ? "mt-20" : "mt-12"}`}>
        {grid.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
