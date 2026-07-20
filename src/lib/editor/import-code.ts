import type { BundledLanguage } from "shiki";

export type ImportResult = {
  code: string;
  filename?: string;
  language?: BundledLanguage;
};

// File extension → a Shiki language we bundle (see LANGUAGES in constants.ts).
const EXT_LANG: Record<string, BundledLanguage> = {
  ts: "typescript",
  mts: "typescript",
  cts: "typescript",
  tsx: "tsx",
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  jsx: "jsx",
  py: "python",
  html: "html",
  htm: "html",
  css: "css",
  json: "json",
  sh: "bash",
  bash: "bash",
  zsh: "bash",
  go: "go",
  rs: "rust",
};

function langFromFilename(name?: string): BundledLanguage | undefined {
  const ext = name?.split(".").pop()?.toLowerCase();
  return ext ? EXT_LANG[ext] : undefined;
}

/**
 * Fetch code from a public URL — a GitHub gist, a github.com blob link, or any
 * raw/plain text URL. No auth; unauthenticated GitHub requests are rate-limited.
 */
export async function importCode(input: string): Promise<ImportResult> {
  const url = input.trim();
  if (!url) throw new Error("empty url");

  const gist = url.match(/gist\.github\.com\/(?:[^/]+\/)?([0-9a-f]{6,})/i);
  if (gist) return importGist(gist[1]);

  const blob = url.match(
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/i,
  );
  if (blob) {
    return importRaw(
      `https://raw.githubusercontent.com/${blob[1]}/${blob[2]}/${blob[3]}`,
    );
  }

  return importRaw(url);
}

type GistFile = {
  filename?: string;
  content?: string;
  truncated?: boolean;
  raw_url?: string;
};

async function importGist(id: string): Promise<ImportResult> {
  const res = await fetchWithTimeout(`https://api.github.com/gists/${id}`);
  if (!res.ok) throw new Error(`gist fetch failed (${res.status})`);
  const json = (await res.json()) as { files?: Record<string, GistFile> };
  const files = Object.values(json.files ?? {});
  if (files.length === 0) throw new Error("gist has no files");

  const file = files[0];
  let content = file.content ?? "";
  if (file.truncated && file.raw_url) {
    const raw = await fetchWithTimeout(file.raw_url);
    if (raw.ok) content = await raw.text();
  }
  return {
    code: content,
    filename: file.filename,
    language: langFromFilename(file.filename),
  };
}

async function importRaw(url: string): Promise<ImportResult> {
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`fetch failed (${res.status})`);
  const code = await res.text();
  const filename = url.split(/[?#]/)[0].split("/").pop() || undefined;
  return { code, filename, language: langFromFilename(filename) };
}

function fetchWithTimeout(url: string, ms = 10000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() =>
    clearTimeout(timer),
  );
}
