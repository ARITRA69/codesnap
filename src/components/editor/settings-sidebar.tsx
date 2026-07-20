"use client";

import {
  ANGLE_MAX,
  ASPECT_RATIOS,
  BACKGROUNDS,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  FONTS,
  LANGUAGES,
  PADDING_MAX,
  PADDING_MIN,
  RADIUS_MAX,
  RADIUS_MIN,
  SHADOW_MAX,
  SHADOW_MIN,
  THEMES,
  WINDOW_STYLES,
  type CustomBgMode,
  type LanguageId,
} from "@/lib/editor/constants";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { useEditor } from "./editor-context";

type ComboboxOption<T extends string> = { value: T; label: string };

const LANGUAGE_ITEMS: ComboboxOption<LanguageId>[] = [
  { value: "auto", label: "Auto detect" },
  ...LANGUAGES.map((lang) => ({ value: lang.id, label: lang.label })),
];

const FONT_ITEMS: ComboboxOption<string>[] = FONTS.map((font) => ({
  value: font.id,
  label: font.label,
}));

export function SettingsSidebar() {
  const { settings, update } = useEditor();
  return (
    <aside className="flex w-72 shrink-0 flex-col gap-6 overflow-y-auto border-l bg-card p-5">
      <LanguageField />
      <ThemeField />
      <FontField />
      <BackgroundField />
      <CustomBackgroundField />
      <BackgroundImageField />
      <SegmentedField
        title="Window"
        options={WINDOW_STYLES}
        value={settings.windowStyle}
        onChange={(v) => update("windowStyle", v)}
      />
      <SegmentedField
        title="Aspect Ratio"
        options={ASPECT_RATIOS}
        value={settings.aspectRatio}
        onChange={(v) => update("aspectRatio", v)}
      />
      <SliderField
        title="Padding"
        min={PADDING_MIN}
        max={PADDING_MAX}
        step={4}
        value={settings.padding}
        onChange={(v) => update("padding", v)}
      />
      <SliderField
        title="Corner Radius"
        min={RADIUS_MIN}
        max={RADIUS_MAX}
        step={1}
        value={settings.cornerRadius}
        onChange={(v) => update("cornerRadius", v)}
      />
      <SliderField
        title="Shadow"
        min={SHADOW_MIN}
        max={SHADOW_MAX}
        step={5}
        value={settings.shadow}
        onChange={(v) => update("shadow", v)}
      />
      <HighlightLinesField />
      <WatermarkField />
      <ToggleRow
        label="Line Numbers"
        checked={settings.showLineNumbers}
        onChange={(v) => update("showLineNumbers", v)}
      />
    </aside>
  );
}

/* ---------- shared primitives ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SliderField({
  title,
  min,
  max,
  step,
  value,
  onChange,
}: {
  title: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <Section title={title}>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
        />
        <span className="w-10 text-right text-sm text-muted-foreground tabular-nums">
          {value}
        </span>
      </div>
    </Section>
  );
}

function SegmentedField<T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <Section title={title}>
      <div
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        }}
      >
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "h-8 rounded-md border text-xs transition-colors hover:bg-muted",
              value === opt.id
                ? "border-ring bg-muted ring-2 ring-ring/40"
                : "border-border",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </Section>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`Toggle ${label.toLowerCase()}`}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4 rounded-full bg-background shadow-sm transition-transform",
            checked ? "translate-x-4" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}

/* ---------- fields ---------- */

function LanguageField() {
  const { settings, update, effectiveLanguage } = useEditor();
  const detectedLabel =
    LANGUAGES.find((l) => l.id === effectiveLanguage)?.label ??
    effectiveLanguage;
  return (
    <Section title="Language">
      <Combobox
        items={LANGUAGE_ITEMS}
        value={
          LANGUAGE_ITEMS.find((item) => item.value === settings.language) ??
          null
        }
        onValueChange={(item) => update("language", item?.value ?? "auto")}
      >
        <ComboboxInput placeholder="Select language" className="w-full" />
        <ComboboxContent>
          <ComboboxEmpty>No language found.</ComboboxEmpty>
          <ComboboxList>
            {(item: ComboboxOption<LanguageId>) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {settings.language === "auto" && (
        <p className="text-xs text-muted-foreground">
          Detected: {detectedLabel}
        </p>
      )}
    </Section>
  );
}

function ThemeField() {
  const { settings, update } = useEditor();
  return (
    <Section title="Theme">
      <div className="grid grid-cols-2 gap-2">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => update("theme", theme.id)}
            className={cn(
              "flex items-center gap-2 rounded-md border px-2.5 py-2 text-left text-xs transition-colors hover:bg-muted",
              settings.theme === theme.id
                ? "border-ring ring-2 ring-ring/40"
                : "border-border",
            )}
          >
            <span
              className="size-3.5 shrink-0 rounded-full border border-black/10"
              style={{
                background: theme.appearance === "dark" ? "#282c34" : "#ffffff",
              }}
            />
            <span className="truncate">{theme.label}</span>
          </button>
        ))}
      </div>
    </Section>
  );
}

function FontField() {
  const { settings, update } = useEditor();
  return (
    <Section title="Font">
      <Combobox
        items={FONT_ITEMS}
        value={
          FONT_ITEMS.find((item) => item.value === settings.fontFamily) ?? null
        }
        onValueChange={(item) => {
          if (item) update("fontFamily", item.value);
        }}
      >
        <ComboboxInput placeholder="Select font" className="w-full" />
        <ComboboxContent>
          <ComboboxEmpty>No font found.</ComboboxEmpty>
          <ComboboxList>
            {(item: ComboboxOption<string>) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={FONT_SIZE_MIN}
          max={FONT_SIZE_MAX}
          step={1}
          value={settings.fontSize}
          onChange={(e) => update("fontSize", Number(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
        />
        <span className="w-14 text-right text-sm text-muted-foreground tabular-nums">
          {settings.fontSize}px
        </span>
      </div>
    </Section>
  );
}

function BackgroundField() {
  const { settings, update } = useEditor();
  return (
    <Section title="Background">
      <div className="grid grid-cols-5 gap-2">
        {BACKGROUNDS.map((bg) => (
          <button
            key={bg.id}
            type="button"
            title={bg.label}
            onClick={() => update("background", bg.id)}
            className={cn(
              "aspect-square rounded-md border transition-transform hover:scale-105",
              settings.background === bg.id
                ? "border-ring ring-2 ring-ring/50"
                : "border-black/10",
              bg.transparent && "cs-checkerboard",
            )}
            style={bg.transparent ? undefined : { background: bg.css }}
          />
        ))}
      </div>
    </Section>
  );
}

function CustomBackgroundField() {
  const { settings, update } = useEditor();
  const active = settings.background === "custom" && !settings.backgroundImage;
  const css =
    settings.customMode === "solid"
      ? settings.customColor1
      : `linear-gradient(${settings.customAngle}deg, ${settings.customColor1}, ${settings.customColor2})`;

  const apply = <
    K extends "customMode" | "customColor1" | "customColor2" | "customAngle",
  >(
    key: K,
    value: (typeof settings)[K],
  ) => {
    update(key, value);
    update("background", "custom");
  };

  return (
    <Section title="Custom Background">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Use custom background"
          onClick={() => update("background", "custom")}
          className={cn(
            "size-9 shrink-0 rounded-md border",
            active ? "border-ring ring-2 ring-ring/50" : "border-black/10",
          )}
          style={{ background: css }}
        />
        <div className="grid flex-1 grid-cols-2 gap-1.5">
          {(["solid", "gradient"] as CustomBgMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => apply("customMode", mode)}
              className={cn(
                "h-8 rounded-md border text-xs capitalize transition-colors hover:bg-muted",
                active && settings.customMode === mode
                  ? "border-ring bg-muted ring-2 ring-ring/40"
                  : "border-border",
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ColorInput
          value={settings.customColor1}
          onChange={(v) => apply("customColor1", v)}
        />
        {settings.customMode === "gradient" && (
          <ColorInput
            value={settings.customColor2}
            onChange={(v) => apply("customColor2", v)}
          />
        )}
      </div>
      {settings.customMode === "gradient" && (
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={ANGLE_MAX}
            step={5}
            value={settings.customAngle}
            onChange={(e) => apply("customAngle", Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
          />
          <span className="w-10 text-right text-sm text-muted-foreground tabular-nums">
            {settings.customAngle}°
          </span>
        </div>
      )}
    </Section>
  );
}

function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 flex-1 cursor-pointer rounded-md border bg-background"
    />
  );
}

function BackgroundImageField() {
  const { settings, update } = useEditor();

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("backgroundImage", String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <Section title="Background Image">
      {settings.backgroundImage ? (
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={settings.backgroundImage}
            alt="Background preview"
            className="h-9 w-16 rounded-md border object-cover"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => update("backgroundImage", null)}
          >
            Remove
          </Button>
        </div>
      ) : (
        <label className="flex h-9 cursor-pointer items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground transition-colors hover:bg-muted">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFile}
          />
          Upload image
        </label>
      )}
    </Section>
  );
}

function HighlightLinesField() {
  const { settings, update } = useEditor();
  return (
    <Section title="Highlight Lines">
      <input
        type="text"
        value={settings.highlightLines}
        onChange={(e) => update("highlightLines", e.target.value)}
        placeholder="e.g. 1-3, 5"
        className="h-9 w-full rounded-md border bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
    </Section>
  );
}

function WatermarkField() {
  const { settings, update } = useEditor();
  return (
    <div className="flex flex-col gap-2.5">
      <ToggleRow
        label="Watermark"
        checked={settings.watermark}
        onChange={(v) => update("watermark", v)}
      />
      {settings.watermark && (
        <input
          type="text"
          value={settings.watermarkText}
          onChange={(e) => update("watermarkText", e.target.value)}
          placeholder="@yourhandle"
          className="h-9 w-full rounded-md border bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      )}
    </div>
  );
}
