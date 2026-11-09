import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import type { ReactNode } from 'react';

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
    background-color: #0A0C10;
  }
}`;
