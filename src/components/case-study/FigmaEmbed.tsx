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
  const dashNodeId = toDashNodeId(nodeId);
  const protoUrl = `https://www.figma.com/proto/${fileKey}/${encodeURIComponent(
    fileName
  )}?node-id=${dashNodeId}&starting-point-node-id=${dashNodeId}&scaling=scale-down-width&content-scaling=fixed&embed_host=share`;
  const src = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(
    protoUrl
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
