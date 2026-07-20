"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import detectLanguage from "flourite";
import type { BundledLanguage, BundledTheme, Highlighter } from "shiki";
import {
  clampLanguage,
  DEFAULT_SETTINGS,
  type AspectRatioId,
  type CustomBgMode,
  type LanguageId,
  type WindowStyleId,
} from "@/lib/editor/constants";
import { getHighlighter } from "@/lib/editor/highlighter";
import { decodeSharedSettings } from "@/lib/editor/share";

export type EditorSettings = {
  code: string;
  language: LanguageId;
  theme: BundledTheme;
  background: string;
  padding: number;
  filename: string;
  showLineNumbers: boolean;
  aspectRatio: AspectRatioId;
  fontFamily: string;
  fontSize: number;
  windowStyle: WindowStyleId;
  cornerRadius: number;
  shadow: number;
  highlightLines: string;
  backgroundImage: string | null;
  customMode: CustomBgMode;
  customColor1: string;
  customColor2: string;
  customAngle: number;
  watermark: boolean;
  watermarkText: string;
};

type EditorContextValue = {
  settings: EditorSettings;
  update: <K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K],
  ) => void;
  highlighter: Highlighter | null;
  /** Concrete Shiki language actually used for highlighting (resolves "auto"). */
  effectiveLanguage: BundledLanguage;
};

const STORAGE_KEY = "codesnap:settings:v1";

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    getHighlighter().then((h) => {
      if (active) setHighlighter(h);
    });
    return () => {
      active = false;
    };
  }, []);

  // On mount, restore state (after first render → no hydration mismatch).
  // A shared link (#s=...) wins over localStorage; we then clean the URL so the
  // user's later edits (persisted to localStorage) survive a reload.
  useEffect(() => {
    try {
      const shared = decodeSharedSettings(window.location.hash);
      if (shared) {
        setSettings({ ...DEFAULT_SETTINGS, ...shared });
        history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
        setHydrated(true);
        return;
      }
    } catch {
      // fall through to localStorage
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  // Persist on change, but only after the initial load has run.
  // The uploaded background image is excluded — data URLs can blow the storage quota.
  useEffect(() => {
    if (!hydrated) return;
    try {
      // Exclude the uploaded background image — a data URL can blow the storage quota.
      const { backgroundImage, ...persisted } = settings;
      void backgroundImage;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // ignore quota / private-mode errors
    }
  }, [settings, hydrated]);

  const update = useCallback(
    <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const effectiveLanguage = useMemo<BundledLanguage>(() => {
    if (settings.language !== "auto") return settings.language;
    const { language } = detectLanguage(settings.code || "", { shiki: true });
    return clampLanguage(language);
  }, [settings.language, settings.code]);

  const value = useMemo(
    () => ({ settings, update, highlighter, effectiveLanguage }),
    [settings, update, highlighter, effectiveLanguage],
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor(): EditorContextValue {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within an EditorProvider");
  return ctx;
}
