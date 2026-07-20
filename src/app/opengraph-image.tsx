import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "CodeSnap — Beautiful code screenshots";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const colors = {
  background: "#171512",
  card: "#211f1c",
  border: "rgba(255, 255, 255, 0.08)",
  text: "#f2efe9",
  muted: "#8f8a82",
  keyword: "#c792ea",
  fn: "#82aaff",
  string: "#c3e88d",
  punct: "#7d7873",
};

type Token = { text: string; color?: string };

const snippet: Token[][] = [
  [
    { text: "const ", color: colors.keyword },
    { text: "snap " },
    { text: "= ", color: colors.punct },
    { text: "await ", color: colors.keyword },
    { text: "codesnap", color: colors.fn },
    { text: "({", color: colors.punct },
  ],
  [
    { text: "  code" },
    { text: ": ", color: colors.punct },
    { text: '"hello, world"', color: colors.string },
    { text: ",", color: colors.punct },
  ],
  [
    { text: "  theme" },
    { text: ": ", color: colors.punct },
    { text: '"midnight"', color: colors.string },
    { text: ",", color: colors.punct },
  ],
  [{ text: "});", color: colors.punct }],
  [{ text: " " }],
  [
    { text: "share", color: colors.fn },
    { text: "(snap);", color: colors.punct },
  ],
];

export default async function Image() {
  const fontDir = join(
    process.cwd(),
    "node_modules",
    "@fontsource",
    "jetbrains-mono",
    "files",
  );
  const [mono400, mono700] = await Promise.all([
    readFile(join(fontDir, "jetbrains-mono-latin-400-normal.woff")),
    readFile(join(fontDir, "jetbrains-mono-latin-700-normal.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 80px",
          backgroundColor: colors.background,
          backgroundImage:
            "radial-gradient(circle at 20% 0%, rgba(199, 146, 234, 0.10), transparent 50%), radial-gradient(circle at 90% 100%, rgba(130, 170, 255, 0.10), transparent 50%)",
          fontFamily: "JetBrains Mono",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 480 }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 700,
              color: colors.text,
              letterSpacing: "-0.04em",
            }}
          >
            CodeSnap
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 30,
              lineHeight: 1.5,
              color: colors.muted,
            }}
          >
            Turn your code into beautiful screenshots ready to share.
          </div>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 40,
              padding: "10px 22px",
              borderRadius: 999,
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.card,
              fontSize: 22,
              color: colors.text,
            }}
          >
            codesnap.aritra360.com
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 520,
            borderRadius: 16,
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.card,
            boxShadow: "0 32px 80px rgba(0, 0, 0, 0.55)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              padding: "18px 22px",
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: "#ff5f57",
              }}
            />
            <div
              style={{
                display: "flex",
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: "#febc2e",
              }}
            />
            <div
              style={{
                display: "flex",
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: "#28c840",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              padding: "28px 30px 34px",
              fontSize: 24,
              color: colors.text,
            }}
          >
            {snippet.map((line, i) => (
              <div key={i} style={{ display: "flex" }}>
                {line.map((token, j) => (
                  <span
                    key={j}
                    style={{
                      whiteSpace: "pre",
                      color: token.color ?? colors.text,
                    }}
                  >
                    {token.text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "JetBrains Mono",
          data: mono400,
          weight: 400,
          style: "normal",
        },
        {
          name: "JetBrains Mono",
          data: mono700,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
