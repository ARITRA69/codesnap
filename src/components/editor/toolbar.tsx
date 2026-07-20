"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { Menu } from "@base-ui/react/menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Copy01Icon,
  Download01Icon,
  Image01Icon,
  Link01Icon,
  SourceCodeIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { copyPng, downloadImage, type ExportFormat } from "@/lib/editor/export";
import { buildShareUrl } from "@/lib/editor/share";
import { useEditor } from "./editor-context";
import { ImportButton } from "./import-button";
import { ThemeToggle } from "./theme-toggle";

export function Toolbar({ canvasRef }: { canvasRef: RefObject<HTMLDivElement | null> }) {
  const { settings } = useEditor();
  const [imageCopied, setImageCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [busy, setBusy] = useState<"copy" | "download" | null>(null);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(buildShareUrl(settings));
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1800);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCopyImage() {
    if (!canvasRef.current) return;
    setBusy("copy");
    try {
      await copyPng(canvasRef.current);
      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(null);
    }
  }

  async function handleDownload(format: ExportFormat) {
    if (!canvasRef.current) return;
    setBusy("download");
    try {
      await downloadImage(canvasRef.current, settings.filename, format);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(null);
    }
  }

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(settings.code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 1800);
    } catch (err) {
      console.error(err);
    }
  }

  // Keyboard shortcuts: ⌘S download PNG, ⌘⇧C copy image. Refs keep the listener stable.
  const copyImageRef = useRef(handleCopyImage);
  const downloadRef = useRef(handleDownload);
  copyImageRef.current = handleCopyImage;
  downloadRef.current = handleDownload;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key.toLowerCase() === "s" && !e.shiftKey) {
        e.preventDefault();
        downloadRef.current("png");
      } else if (e.key.toLowerCase() === "c" && e.shiftKey) {
        e.preventDefault();
        copyImageRef.current();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={SourceCodeIcon} className="size-5 text-primary" />
          <span className="text-sm font-semibold">CodeSnap</span>
        </div>
        <ImportButton />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="sm" onClick={handleCopyCode}>
          <HugeiconsIcon icon={codeCopied ? Tick01Icon : Copy01Icon} />
          {codeCopied ? "Copied" : "Copy code"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyImage}
          disabled={busy !== null}
          title="Copy image (⌘⇧C)"
        >
          <HugeiconsIcon icon={imageCopied ? Tick01Icon : Image01Icon} />
          {imageCopied ? "Copied" : "Copy image"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          title="Copy a shareable link to this snippet"
        >
          <HugeiconsIcon icon={linkCopied ? Tick01Icon : Link01Icon} />
          {linkCopied ? "Link copied" : "Share"}
        </Button>
        <ButtonGroup>
          <Button
            size="sm"
            onClick={() => handleDownload("png")}
            disabled={busy !== null}
            title="Download PNG (⌘S)"
          >
            <HugeiconsIcon icon={Download01Icon} />
            Download
          </Button>
          <Menu.Root>
            <Menu.Trigger
              render={<Button size="icon-sm" disabled={busy !== null} aria-label="Export format" />}
            >
              <HugeiconsIcon icon={ArrowDown01Icon} />
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner sideOffset={6} align="end" className="z-50">
                <Menu.Popup className="min-w-36 rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none">
                  <ExportMenuItem onClick={() => handleDownload("png")}>
                    Download PNG
                  </ExportMenuItem>
                  <ExportMenuItem onClick={() => handleDownload("svg")}>
                    Download SVG
                  </ExportMenuItem>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        </ButtonGroup>
      </div>
    </header>
  );
}

function ExportMenuItem({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Menu.Item
      onClick={onClick}
      className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[highlighted]:bg-muted"
    >
      {children}
    </Menu.Item>
  );
}

