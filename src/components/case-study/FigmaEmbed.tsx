function toDashNodeId(nodeId: string) {
  return nodeId.replace(":", "-");
}

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
  const designUrl = `https://www.figma.com/design/${fileKey}/${encodeURIComponent(
    fileName
  )}?node-id=${toDashNodeId(nodeId)}`;
  const src = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(
    designUrl
  )}`;

  return (
    <div className="overflow-hidden rounded-sm border border-border-strong bg-card">
      <div className="aspect-[16/10] w-full">
        <iframe
          src={src}
          title={title}
          allowFullScreen
          loading="lazy"
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
