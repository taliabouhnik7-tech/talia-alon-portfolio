/**
 * Live Figma prototype or slides, shown right on the page.
 * A direct "Open in Figma" link sits underneath for full-screen viewing.
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
  const dash = nodeId.replace(":", "-");
  const slug = encodeURIComponent(fileName.replace(/\s+/g, "-"));
  const params = `node-id=${dash}&starting-point-node-id=${dash}&scaling=scale-down-width&content-scaling=fixed`;
  const openUrl = `https://www.figma.com/proto/${fileKey}/${slug}?${params}`;
  const embedUrl = `https://embed.figma.com/proto/${fileKey}/${slug}?${params}&embed-host=talia-alon-portfolio&hide-ui=1`;

  return (
    <div className="overflow-hidden rounded-[12px] bg-canvas ring-1 ring-rule">
      <div className="relative aspect-[16/10] w-full">
        {/* Sits behind the iframe until Figma paints over it. */}
        <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[15px] text-graphite-soft">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-graphite-soft/30 border-t-select motion-reduce:animate-none" />
          Loading the prototype from Figma…
        </div>
        <iframe src={embedUrl} title={title} loading="lazy" allowFullScreen className="absolute inset-0 h-full w-full" />
      </div>
      <div className="flex items-center justify-between border-t border-rule bg-canvas px-4 py-2.5 text-[14px]">
        <span className="text-graphite-soft">{title}</span>
        <a href={openUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-select hover:underline">
          Open full screen
        </a>
      </div>
    </div>
  );
}
