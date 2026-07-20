"use client";

import { useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { HugeiconsIcon } from "@hugeicons/react";
import { CloudDownloadIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { importCode } from "@/lib/editor/import-code";
import { useEditor } from "./editor-context";

export function ImportButton() {
  const { update } = useEditor();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await importCode(url);
      update("code", result.code);
      if (result.filename) update("filename", result.filename);
      if (result.language) update("language", result.language);
      setUrl("");
      setOpen(false);
    } catch {
      setError(
        "Couldn't import — check it's a public gist or raw file URL (and that you're online).",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        render={
          <Button variant="ghost" size="sm" title="Import code from a URL" />
        }
      >
        <HugeiconsIcon icon={CloudDownloadIcon} />
        Import
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={6} align="start" className="z-50">
          <Popover.Popup className="w-80 rounded-lg border bg-popover p-3 text-popover-foreground shadow-md outline-none">
            <form onSubmit={run} className="flex flex-col gap-2">
              <p className="text-sm font-medium">Import code from a URL</p>
              <input
                autoFocus
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Gist, github.com/…/blob/…, or raw URL"
                className="h-9 w-full rounded-md border bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  Public URLs only — no login.
                </p>
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading || !url.trim()}
                >
                  {loading ? "Importing…" : "Import"}
                </Button>
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </form>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
