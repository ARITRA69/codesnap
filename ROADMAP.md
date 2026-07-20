# CodeSnap — Roadmap

A fully client-side tool to turn code into beautiful screenshots for social media.
Each phase below is independently shippable.

> **Project principle: no auth, ever.** No accounts, no login, no user identity, no
> server-side storage. Everything runs in the browser; sharing is done via URL-encoded
> links. Any future feature that would require authentication is out of scope by design.

**Stack:** Next.js 16 · React 19 · Tailwind v4 · shadcn/ui (base-vega) · hugeicons
**Key libs to add:** `shiki` (highlighting) · `react-simple-code-editor` (live edit) · `html-to-image` (PNG export)

Legend: `[ ]` todo · `[~]` in progress · `[x]` done

---

## v1 — MVP (ship today)

Goal: paste code → style the card → export a PNG. Fully client-side.

### Foundation
- [x] Remove create-next-app boilerplate from `page.tsx`
- [x] App layout: preview canvas (center) + settings sidebar (right)
- [x] Global state for editor settings (language, theme, background, padding, filename)

### Editor + highlighting
- [x] Integrate Shiki for syntax highlighting
- [x] Live-editable code area (`react-simple-code-editor` + Shiki overlay)
- [x] Language selector — JS, TS, JSX, TSX, HTML, CSS, JSON, Bash, Python, Go, Rust
- [x] Syntax theme picker — 6 curated themes (dark + light)

### Card styling
- [x] macOS window frame (traffic-light dots, rounded corners, drop shadow)
- [x] Editable filename / title in window bar
- [x] Background: 8 gradient presets + solid colors + transparent
- [x] Padding control (card ↔ background edge)

### Export
- [x] Download PNG at 2x scale (retina)
- [x] Copy image to clipboard

---

## v1.1 — Quick wins

Cheap, high-value adds that layer onto v1 with no rework.

- [x] Line numbers toggle
- [x] Language auto-detect (via flourite; shows detected language)
- [x] Aspect-ratio presets (auto · 1:1 · 16:9 · 4:3)
- [x] Copy code as text (separate from copy image)
- [x] Keyboard shortcuts (⌘⇧C copy image, ⌘S download)
- [x] Remember last settings (localStorage)

---

## v1.2 — Typography & polish

- [x] Font-family picker (JetBrains Mono, Fira Code, Geist Mono, IBM Plex Mono, Source Code Pro + ligature toggle)
- [x] Font size control
- [x] Window-frame style variants (macOS · minimal · none)
- [x] Adjustable corner radius & shadow intensity
- [x] Light/dark app UI theme

> Note: coding fonts are self-hosted via `@fontsource/*` (not `next/font/google`) so they
> work offline, embed reliably in PNG exports, and avoid a build-time network dependency.

---

## v1.3 — Advanced framing

- [x] Line highlighting / focus (dim non-selected lines) — line-range input like `1-3, 5`
- [x] Background image upload (data URL; excluded from localStorage to protect quota)
- [x] Custom solid/gradient color builder (two color stops + angle)
- [x] Watermark / attribution toggle (corner text in the card)
- [x] Export as SVG (PNG/SVG split button in the toolbar)

---

## v2 — Sharing (no backend)

**URL-encoded links only.** The full editor state (code + all style settings) is
compressed into the share URL itself. Zero infrastructure, fully client-side.

- [x] Encode/decode editor state to a compact URL (lz-string, in the `#` fragment)
- [x] Share button — copy shareable link with feedback
- [x] Restore state when a share link is opened (hash → settings, then clean the URL)

### Out of scope — permanently (see project principle)
- Auth / login / user accounts of any kind.
- Save-to-account, snippet gallery, history — all need server-side storage.
- Open Graph preview images — need a server to render each link.

### Deferred (client-side, still possible later)
- [ ] Window tabs / multi-file snippets

---

## Icebox / maybe

All client-side only — nothing here requires auth.

- [ ] Custom syntax-theme editor
- [x] Import from a public GitHub gist / raw URL (no auth — public fetch only) —
      toolbar "Import" popover; accepts gist URLs, `github.com/…/blob/…` links, and raw
      URLs; loads the code + filename and auto-sets the language from the extension.
- [ ] Presets / saved styles (stored in localStorage)

Excluded (would require auth/accounts): direct post-to-X integration, team workspaces.
