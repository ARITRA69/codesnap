"use client";

import { useMemo } from "react";
import Editor from "react-simple-code-editor";
import { parseLineRanges } from "@/lib/editor/constants";
import { highlightToHtml } from "@/lib/editor/highlighter";
import { useEditor } from "./editor-context";

const BASE_PADDING = 20;

export function CodeEditor({
  color,
  fontFamily,
  fontSize,
  leftPadding,
}: {
  color: string;
  fontFamily: string;
  fontSize: number;
  leftPadding?: number;
}) {
  const { settings, update, highlighter, effectiveLanguage } = useEditor();

  const focusLines = useMemo(
    () => parseLineRanges(settings.highlightLines),
    [settings.highlightLines],
  );

  const highlight = (code: string): string => {
    if (!highlighter) return escapePlain(code);
    return highlightToHtml(
      highlighter,
      code,
      effectiveLanguage,
      settings.theme,
      focusLines,
    );
  };

  return (
    <Editor
      value={settings.code}
      onValueChange={(code) => update("code", code)}
      highlight={highlight}
      padding={{
        top: BASE_PADDING,
        right: BASE_PADDING,
        bottom: BASE_PADDING,
        left: leftPadding ?? BASE_PADDING,
      }}
      textareaClassName="cs-code-textarea"
      preClassName="cs-code-pre"
      style={{
        fontFamily,
        fontSize,
        lineHeight: 1.6,
        color,
        fontVariantLigatures: "contextual",
        fontFeatureSettings: '"calt" 1, "liga" 1',
      }}
      spellCheck={false}
    />
  );
}

function escapePlain(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
