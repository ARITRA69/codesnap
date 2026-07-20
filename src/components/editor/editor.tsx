"use client";

import { useRef } from "react";
import { CodeCanvas } from "./code-canvas";
import { EditorProvider } from "./editor-context";
import { SettingsSidebar } from "./settings-sidebar";
import { Toolbar } from "./toolbar";

export function Editor() {
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <EditorProvider>
      <div className="flex h-screen flex-col">
        <Toolbar canvasRef={canvasRef} />
        <div className="flex flex-1 overflow-hidden">
          <main className="flex flex-1 items-center justify-center overflow-auto bg-muted/40 p-10">
            <CodeCanvas ref={canvasRef} />
          </main>
          <SettingsSidebar />
        </div>
      </div>
    </EditorProvider>
  );
}
