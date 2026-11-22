"use client";

import { useState } from "react";

/**
 * Figma prototypes are heavy and sometimes refuse to render inside another
 * site. Show a light poster first, load the live embed on request, and always
 * keep a direct "Open in Figma" link that works everywhere.
 */
export default function FigmaEmbed({
  fileKey,
  fileName,
  nodeId,
  title,
}: {
  fileKey: string;
  fileName: string;
  nodeId: string;
  title: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const dash = nodeId.replace(":", "-");
  const slug = encodeURIComponent(fileName.replace(/\s+/g, "-"));
  const params = `node-id=${dash}&starting-point-node-id=${dash}&scaling=scale-down-width&content-scaling=fixed`;
  const openUrl = `https://www.figma.com/proto/${fileKey}/${slug}?${params}`;
  const embedUrl = `https://embed.figma.com/proto/${fileKey}/${slug}?${params}&embed-host=talia-alon-portfolio`;
  const isDeck = /deck|brand book|presentation/i.test(title);

  return (
    <div className="overflow-hidden rounded-[12px] bg-canvas ring-1 ring-rule">
      <div className="relative aspect-[16/10] w-full">
        {loaded ? (
          <iframe src={embedUrl} title={title} allowFullScreen className="absolute inset-0 h-full w-full" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center">
            <svg width="28" height="42" viewBox="0 0 38 57" aria-hidden>
              <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1abcfe" />
              <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0acf83" />
              <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#ff7262" />
              <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#f24e1e" />
              <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#a259ff" />
            </svg>
            <div>
              <p className="text-[19px] font-semibold tracking-[-0.015em] text-graphite">{title}</p>
              <p className="mt-1 text-[15px] text-graphite-soft">
                {isDeck ? "Slides made in Figma" : "Clickable prototype made in Figma"}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setLoaded(true)}
                className="rounded-full bg-graphite px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-black"
              >
                {isDeck ? "View slides here" : "Try it here"}
              </button>
              <a
                href={openUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-graphite/20 bg-white px-5 py-2.5 text-[15px] font-medium text-graphite transition-colors hover:border-graphite"
              >
                Open in Figma
              </a>
            </div>
          </div>
        )}
      </div>
      {loaded && (
        <div className="flex items-center justify-between border-t border-rule bg-white px-4 py-2.5 text-[14px]">
          <span className="text-graphite-soft">{title}</span>
          <a href={openUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-select hover:underline">
            Open in Figma
          </a>
        </div>
      )}
    </div>
  );
}
