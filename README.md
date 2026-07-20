# CodeSnap

**Turn your code into beautiful screenshots, ready to share.**

CodeSnap is a fully client-side tool for creating polished code images for
social media, blog posts, and documentation. Paste your code, style the card,
and export a crisp PNG or SVG — all in the browser.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca)](https://react.dev)

<!-- Add a screenshot or GIF of the app here, e.g. ![CodeSnap](./public/screenshot.png) -->

## Features

- **Syntax highlighting** powered by [Shiki](https://shiki.style) with a live,
  editable code area.
- **Language support** — JS, TS, JSX, TSX, HTML, CSS, JSON, Bash, Python, Go,
  Rust, and automatic language detection.
- **Curated syntax themes** (dark and light) plus a light/dark app UI.
- **Card styling** — macOS window frame, minimal, or none; editable filename;
  adjustable corner radius and shadow.
- **Backgrounds** — gradient presets, solid colors, a custom two-stop gradient
  builder, image upload, or transparent.
- **Typography** — JetBrains Mono, Fira Code, Geist Mono, IBM Plex Mono, and
  Source Code Pro (self-hosted), with a ligature toggle and font-size control.
- **Framing** — padding control, aspect-ratio presets (auto · 1:1 · 16:9 · 4:3),
  line numbers, line highlighting/focus, and a watermark toggle.
- **Export** — download PNG at 2× (retina) or SVG, or copy the image straight to
  your clipboard. Copy the code as text too.
- **Sharing without a backend** — the full editor state is compressed into the
  URL, so links are self-contained and need zero infrastructure.
- **Import** from a public GitHub gist, `blob` link, or raw URL.
- **Keyboard shortcuts** — ⌘⇧C to copy the image, ⌘S to download.
- Your last settings are remembered via `localStorage`.

## Design principles

- **No auth, ever.** No accounts, no login, no user identity.
- **No backend.** Everything runs in the browser; there is no server-side
  storage. Sharing works through URL-encoded links.

See [`ROADMAP.md`](./ROADMAP.md) for the full feature history and what's planned.

## Tech stack

Next.js 16 · React 19 · Tailwind CSS v4 · shadcn/ui · Hugeicons · Shiki ·
`react-simple-code-editor` · `html-to-image` · `lz-string` · `flourite`

## Getting started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 20+

### Install & run

```bash
# Clone the repo
git clone https://github.com/ARITRA69/codesnap.git
cd codesnap

# Install dependencies
bun install

# Start the dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> Prefer npm/pnpm/yarn? They work too — swap `bun` for your package manager of
> choice (e.g. `npm install && npm run dev`).

## Scripts

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `bun dev`              | Start the development server             |
| `bun run build`        | Build for production                     |
| `bun start`            | Run the production build                 |
| `bun run lint`         | Lint with ESLint                         |
| `bun run format`       | Format the codebase with Prettier        |
| `bun run format:check` | Check formatting without writing changes |

## Contributing

Contributions are welcome! To get started:

1. Fork the repository and create a feature branch.
2. Make your changes, keeping them consistent with the
   [design principles](#design-principles) — anything requiring auth or a
   backend is out of scope by design.
3. Run `bun run lint` and `bun run format` before committing.
4. Open a pull request describing what you changed and why.

For larger features, consider opening an issue first to discuss the approach.

## License

Released under the [MIT License](./LICENSE).
