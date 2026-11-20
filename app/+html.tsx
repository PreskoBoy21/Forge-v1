import {
  ScrollViewStyleReset,
  useServerDocumentContext,
} from 'expo-router/html';
import type { ReactNode } from 'react';

const BASE = process.env.EXPO_PUBLIC_BASE_URL ?? '';

// Web-only HTML shell. Since Expo SDK 58 the root must render the injected
// head/body nodes (JS bundles, CSS, fonts) or the page never loads its scripts.
export default function Root({ children }: { children: ReactNode }) {
  const { htmlAttributes, bodyAttributes, headNodes, bodyNodes } =
    useServerDocumentContext();
  return (
    <html lang="en" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/* Installable web app: Add to Home Screen opens full-screen. */}
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Forge" />
        <meta
          name="description"
          content="Forge, your AI gym coach: today's workout, the exact weights and how much protein is left."
        />
        <link rel="manifest" href={`${BASE}/manifest.json`} />
        <link rel="apple-touch-icon" href={`${BASE}/icons/icon-180.png`} />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #F3F5F8;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000000;
  }
}`;
