import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { DEFAULT_SETTINGS } from "./constants";
import type { EditorSettings } from "@/components/editor/editor-context";

const HASH_KEY = "s";
const VERSION = 1;

/**
 * Compress the editor state into a URL-safe string. The uploaded background
 * image (a potentially huge data URL) is intentionally left out.
 */
export function encodeSettings(settings: EditorSettings): string {
  const { backgroundImage, ...rest } = settings;
  void backgroundImage;
  const payload = JSON.stringify({ v: VERSION, d: rest });
  return compressToEncodedURIComponent(payload);
}

export function buildShareUrl(settings: EditorSettings): string {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#${HASH_KEY}=${encodeSettings(settings)}`;
}

/**
 * Decode a share link's hash back into a partial settings object.
 * Only keys we recognise are kept; the caller merges over DEFAULT_SETTINGS.
 */
export function decodeSharedSettings(
  hash: string,
): Partial<EditorSettings> | null {
  const segment = hash
    .replace(/^#/, "")
    .split("&")
    .find((p) => p.startsWith(`${HASH_KEY}=`));
  if (!segment) return null;

  const encoded = segment.slice(HASH_KEY.length + 1);
  if (!encoded) return null;

  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const parsed = JSON.parse(json) as
      { d?: unknown } | Record<string, unknown>;
    const data =
      parsed && typeof parsed === "object" && "d" in parsed
        ? (parsed.d as Record<string, unknown>)
        : (parsed as Record<string, unknown>);
    if (!data || typeof data !== "object") return null;

    const clean: Record<string, unknown> = {};
    for (const key of Object.keys(DEFAULT_SETTINGS)) {
      if (key in data) clean[key] = data[key];
    }
    return clean as Partial<EditorSettings>;
  } catch {
    return null;
  }
}
