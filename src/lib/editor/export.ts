import { toBlob, toPng, toSvg } from "html-to-image";

export type ExportFormat = "png" | "svg";

const EXPORT_OPTIONS = {
  pixelRatio: 2,
  cacheBust: true,
};

export async function downloadImage(
  node: HTMLElement,
  filename: string,
  format: ExportFormat,
) {
  const dataUrl =
    format === "svg"
      ? await toSvg(node, EXPORT_OPTIONS)
      : await toPng(node, EXPORT_OPTIONS);
  const link = document.createElement("a");
  link.download = toExportName(filename, format);
  link.href = dataUrl;
  link.click();
}

export async function copyPng(node: HTMLElement) {
  const blob = await toBlob(node, EXPORT_OPTIONS);
  if (!blob) throw new Error("Failed to render image");
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}

function toExportName(filename: string, format: ExportFormat): string {
  const base = filename.trim().replace(/\.[^.]+$/, "") || "codesnap";
  return `${base}.${format}`;
}
