import {
  createHighlighter,
  type BundledLanguage,
  type BundledTheme,
  type Highlighter,
} from "shiki";
import { LANGUAGES, THEMES } from "./constants";

let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: THEMES.map((t) => t.id),
      langs: LANGUAGES.map((l) => l.id),
    });
  }
  return highlighterPromise;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const FONT_STYLE_ITALIC = 1;
const FONT_STYLE_BOLD = 2;
const FONT_STYLE_UNDERLINE = 4;

/**
 * Render code to highlighted HTML for use inside react-simple-code-editor.
 * Returns line-wrapped spans with inline colors — no outer <pre> wrapper, so
 * the caret in the transparent textarea stays aligned with the tokens.
 */
export function highlightToHtml(
  highlighter: Highlighter,
  code: string,
  lang: BundledLanguage,
  theme: BundledTheme,
  focusLines?: Set<number> | null,
): string {
  const { tokens } = highlighter.codeToTokens(code, {
    lang,
    theme,
    includeExplanation: false,
  });
  const hasFocus = !!focusLines && focusLines.size > 0;

  return tokens
    .map((line, index) => {
      const inner = line
        .map((token) => {
          const styles = [`color:${token.color ?? "inherit"}`];
          if (token.fontStyle) {
            if (token.fontStyle & FONT_STYLE_ITALIC)
              styles.push("font-style:italic");
            if (token.fontStyle & FONT_STYLE_BOLD)
              styles.push("font-weight:bold");
            if (token.fontStyle & FONT_STYLE_UNDERLINE)
              styles.push("text-decoration:underline");
          }
          return `<span style="${styles.join(";")}">${escapeHtml(token.content)}</span>`;
        })
        .join("");
      const dim = hasFocus && !focusLines!.has(index + 1);
      const cls = dim ? "cs-line cs-line-dim" : "cs-line";
      return `<span class="${cls}">${inner || "​"}</span>`;
    })
    .join("\n");
}

export type ThemeColors = { fg: string; bg: string };

export function getThemeColors(
  highlighter: Highlighter,
  theme: BundledTheme,
): ThemeColors {
  const resolved = highlighter.getTheme(theme);
  return {
    fg: resolved.fg ?? "#ffffff",
    bg: resolved.bg ?? "#1e1e1e",
  };
}
