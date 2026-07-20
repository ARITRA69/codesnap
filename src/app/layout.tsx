import type { Metadata } from "next";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-700.css";
import "@fontsource/fira-code/latin-400.css";
import "@fontsource/fira-code/latin-700.css";
import "@fontsource/geist-mono/latin-400.css";
import "@fontsource/geist-mono/latin-700.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-700.css";
import "@fontsource/source-code-pro/latin-400.css";
import "@fontsource/source-code-pro/latin-700.css";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://codesnap.aritra360.com"),
  title: "CodeSnap — Beautiful code screenshots",
  description: "Turn your code into beautiful screenshots ready to share.",
  openGraph: {
    title: "CodeSnap — Beautiful code screenshots",
    description: "Turn your code into beautiful screenshots ready to share.",
    url: "/",
    siteName: "CodeSnap",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeSnap — Beautiful code screenshots",
    description: "Turn your code into beautiful screenshots ready to share.",
  },
};

const themeScript = `try{var t=localStorage.getItem('codesnap:theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
