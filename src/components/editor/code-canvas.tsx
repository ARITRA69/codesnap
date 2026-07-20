"use client";

import { forwardRef, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  getAspectRatio,
  getFontFamily,
  resolveBackgroundCss,
  type WindowStyleId,
} from "@/lib/editor/constants";
import { getThemeColors } from "@/lib/editor/highlighter";
import { CodeEditor } from "./code-editor";
import { useEditor } from "./editor-context";

const BASE_PADDING = 20; // matches CodeEditor
const GUTTER_GAP = 16;

export const CodeCanvas = forwardRef<HTMLDivElement>(function CodeCanvas(_props, ref) {
  const { settings } = useEditor();
  const background = resolveBackgroundCss(settings);

  const cardRef = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState<{ w: number; h: number } | null>(null);
  const ratio = getAspectRatio(settings.aspectRatio);

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const measure = () => setCardSize({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const outerStyle = useMemo(() => {
    if (ratio && cardSize) {
      const p = settings.padding;
      let w = cardSize.w + 2 * p;
      let h = cardSize.h + 2 * p;
      if (w / h < ratio) w = h * ratio;
      else h = w / ratio;
      return {
        background: background.css,
        width: w,
        height: h,
        display: "flex" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
      };
    }
    return {
      background: background.css,
      padding: settings.padding,
      display: "inline-block" as const,
    };
  }, [ratio, cardSize, settings.padding, background.css]);

  return (
    <div ref={ref} style={outerStyle}>
      <div ref={cardRef} className="inline-block">
        <CodeCard />
      </div>
    </div>
  );
});

function CodeCard() {
  const { settings, highlighter } = useEditor();
  const colors = highlighter
    ? getThemeColors(highlighter, settings.theme)
    : { fg: "#e5e7eb", bg: "#282c34" };
  const fontFamily = getFontFamily(settings.fontFamily);

  const lineCount = useMemo(() => settings.code.split("\n").length, [settings.code]);
  const charWidth = settings.fontSize * 0.6;
  const gutterWidth = settings.showLineNumbers
    ? String(lineCount).length * charWidth
    : 0;
  const leftPadding = settings.showLineNumbers
    ? BASE_PADDING + gutterWidth + GUTTER_GAP
    : BASE_PADDING;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: colors.bg,
        borderRadius: settings.cornerRadius,
        boxShadow: shadowFor(settings.shadow),
        minWidth: 340,
      }}
    >
      <TitleBar
        style={settings.windowStyle}
        fontFamily={fontFamily}
        fontSize={settings.fontSize}
      />
      <div className="relative cs-code-scroll">
        {settings.showLineNumbers && (
          <LineNumbers
            count={lineCount}
            width={gutterWidth}
            fontSize={settings.fontSize}
            fontFamily={fontFamily}
            color={colors.fg}
          />
        )}
        <CodeEditor
          color={colors.fg}
          fontFamily={fontFamily}
          fontSize={settings.fontSize}
          leftPadding={leftPadding}
        />
      </div>
      {settings.watermark && settings.watermarkText.trim() && (
        <div
          className="pointer-events-none absolute right-3.5 bottom-2.5 select-none"
          style={{
            fontFamily,
            fontSize: Math.max(10, settings.fontSize - 3),
            color: colors.fg,
            opacity: 0.45,
          }}
        >
          {settings.watermarkText}
        </div>
      )}
    </div>
  );
}

function shadowFor(intensity: number): string {
  if (intensity <= 0) return "none";
  const y = intensity * 0.3;
  const blur = intensity * 0.7;
  const alpha = 0.35 * (intensity / 100);
  return `0 ${y}px ${blur}px rgba(0,0,0,${alpha.toFixed(3)}), 0 2px 8px rgba(0,0,0,${(alpha * 0.6).toFixed(3)})`;
}

function LineNumbers({
  count,
  width,
  fontSize,
  fontFamily,
  color,
}: {
  count: number;
  width: number;
  fontSize: number;
  fontFamily: string;
  color: string;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute select-none"
      style={{
        top: BASE_PADDING,
        left: BASE_PADDING,
        width,
        fontFamily,
        fontSize,
        lineHeight: 1.6,
        textAlign: "right",
        color,
        opacity: 0.35,
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  );
}

function TitleBar({
  style,
  fontFamily,
  fontSize,
}: {
  style: WindowStyleId;
  fontFamily: string;
  fontSize: number;
}) {
  const { settings, update } = useEditor();
  if (style === "none") return null;

  const filenameInput = (
    <input
      value={settings.filename}
      onChange={(e) => update("filename", e.target.value)}
      spellCheck={false}
      aria-label="File name"
      className="border-none bg-transparent text-center text-white/50 outline-none focus:text-white/80"
      style={{ fontFamily, fontSize: fontSize - 1 }}
    />
  );

  if (style === "minimal") {
    return <div className="flex items-center justify-center px-4 py-2.5">{filenameInput}</div>;
  }

  return (
    <div className="relative flex items-center px-4 py-3">
      <div className="flex gap-2">
        <span className="size-3 rounded-full" style={{ background: "#ff5f56" }} />
        <span className="size-3 rounded-full" style={{ background: "#ffbd2e" }} />
        <span className="size-3 rounded-full" style={{ background: "#27c93f" }} />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2">{filenameInput}</div>
    </div>
  );
}
