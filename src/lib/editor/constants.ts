import type { BundledLanguage, BundledTheme } from "shiki";

export type LanguageOption = {
  id: BundledLanguage;
  label: string;
};

export type ThemeOption = {
  id: BundledTheme;
  label: string;
  appearance: "dark" | "light";
};

export type BackgroundOption = {
  id: string;
  label: string;
  css: string;
  transparent?: boolean;
};

export const LANGUAGES: LanguageOption[] = [
  { id: "typescript", label: "TypeScript" },
  { id: "tsx", label: "TSX" },
  { id: "javascript", label: "JavaScript" },
  { id: "jsx", label: "JSX" },
  { id: "python", label: "Python" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "json", label: "JSON" },
  { id: "bash", label: "Bash" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
];

export const THEMES: ThemeOption[] = [
  { id: "github-dark", label: "GitHub Dark", appearance: "dark" },
  { id: "one-dark-pro", label: "One Dark Pro", appearance: "dark" },
  { id: "dracula", label: "Dracula", appearance: "dark" },
  { id: "nord", label: "Nord", appearance: "dark" },
  { id: "vitesse-dark", label: "Vitesse Dark", appearance: "dark" },
  { id: "github-light", label: "GitHub Light", appearance: "light" },
];

export const BACKGROUNDS: BackgroundOption[] = [
  { id: "candy", label: "Candy", css: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)" },
  { id: "twilight", label: "Twilight", css: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { id: "ocean", label: "Ocean", css: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { id: "grape", label: "Grape", css: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)" },
  { id: "forest", label: "Forest", css: "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)" },
  { id: "flame", label: "Flame", css: "linear-gradient(135deg, #f83600 0%, #f9d423 100%)" },
  { id: "night", label: "Night", css: "linear-gradient(135deg, #232526 0%, #414345 100%)" },
  { id: "peach", label: "Peach", css: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
  { id: "slate", label: "Slate", css: "#1e293b" },
  { id: "white", label: "White", css: "#ffffff" },
  { id: "transparent", label: "Transparent", css: "transparent", transparent: true },
];

export const DEFAULT_CODE = `function greet(name: string) {
  const message = \`Hello, \${name}!\`;
  console.log(message);
  return message;
}

greet("world");
`;

export type AspectRatioId = "auto" | "1:1" | "16:9" | "4:3";

export type AspectRatioOption = {
  id: AspectRatioId;
  label: string;
  ratio: number | null;
};

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: "auto", label: "Auto", ratio: null },
  { id: "1:1", label: "1:1", ratio: 1 },
  { id: "16:9", label: "16:9", ratio: 16 / 9 },
  { id: "4:3", label: "4:3", ratio: 4 / 3 },
];

export type LanguageId = BundledLanguage | "auto";

export type FontOption = {
  id: string;
  label: string;
  family: string;
};

export const FONTS: FontOption[] = [
  { id: "jetbrains-mono", label: "JetBrains Mono", family: "JetBrains Mono" },
  { id: "fira-code", label: "Fira Code", family: "Fira Code" },
  { id: "geist-mono", label: "Geist Mono", family: "Geist Mono" },
  { id: "ibm-plex-mono", label: "IBM Plex Mono", family: "IBM Plex Mono" },
  { id: "source-code-pro", label: "Source Code Pro", family: "Source Code Pro" },
];

export function getFontFamily(id: string): string {
  const font = FONTS.find((f) => f.id === id) ?? FONTS[0];
  return `"${font.family}", ui-monospace, monospace`;
}

export type WindowStyleId = "macos" | "minimal" | "none";

export const WINDOW_STYLES: { id: WindowStyleId; label: string }[] = [
  { id: "macos", label: "macOS" },
  { id: "minimal", label: "Minimal" },
  { id: "none", label: "None" },
];

export type CustomBgMode = "solid" | "gradient";

export const DEFAULT_SETTINGS = {
  code: DEFAULT_CODE,
  language: "typescript" as LanguageId,
  theme: "one-dark-pro" as BundledTheme,
  background: "twilight",
  padding: 48,
  filename: "untitled.ts",
  showLineNumbers: false,
  aspectRatio: "auto" as AspectRatioId,
  fontFamily: "jetbrains-mono",
  fontSize: 14,
  windowStyle: "macos" as WindowStyleId,
  cornerRadius: 12,
  shadow: 60,
  highlightLines: "",
  backgroundImage: null as string | null,
  customMode: "gradient" as CustomBgMode,
  customColor1: "#6366f1",
  customColor2: "#ec4899",
  customAngle: 135,
  watermark: false,
  watermarkText: "@yourhandle",
};

export const ANGLE_MAX = 360;

/** Parse a line-range string like "1-3, 5" into a Set of line numbers. */
export function parseLineRanges(input: string): Set<number> {
  const set = new Set<number>();
  for (const part of input.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const range = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      let a = Number(range[1]);
      let b = Number(range[2]);
      if (a > b) [a, b] = [b, a];
      for (let i = a; i <= b; i++) set.add(i);
    } else if (/^\d+$/.test(trimmed)) {
      set.add(Number(trimmed));
    }
  }
  return set;
}

/** Resolve the CSS `background` value for the current settings. */
export function resolveBackgroundCss(settings: {
  backgroundImage: string | null;
  background: string;
  customMode: CustomBgMode;
  customColor1: string;
  customColor2: string;
  customAngle: number;
}): { css: string; transparent: boolean } {
  if (settings.backgroundImage) {
    return {
      css: `url("${settings.backgroundImage}") center / cover no-repeat`,
      transparent: false,
    };
  }
  if (settings.background === "custom") {
    const css =
      settings.customMode === "solid"
        ? settings.customColor1
        : `linear-gradient(${settings.customAngle}deg, ${settings.customColor1}, ${settings.customColor2})`;
    return { css, transparent: false };
  }
  const bg = getBackground(settings.background);
  return { css: bg.css, transparent: !!bg.transparent };
}

export const PADDING_MIN = 16;
export const PADDING_MAX = 160;
export const FONT_SIZE_MIN = 10;
export const FONT_SIZE_MAX = 24;
export const RADIUS_MIN = 0;
export const RADIUS_MAX = 24;
export const SHADOW_MIN = 0;
export const SHADOW_MAX = 100;

const BUNDLED_LANGS = new Set<string>(LANGUAGES.map((l) => l.id));

/** Clamp a detected language to one we bundled, falling back to TypeScript. */
export function clampLanguage(id: string): BundledLanguage {
  return (BUNDLED_LANGS.has(id) ? id : "typescript") as BundledLanguage;
}

export function getBackground(id: string): BackgroundOption {
  return BACKGROUNDS.find((b) => b.id === id) ?? BACKGROUNDS[0];
}

export function getAspectRatio(id: AspectRatioId): number | null {
  return ASPECT_RATIOS.find((a) => a.id === id)?.ratio ?? null;
}
