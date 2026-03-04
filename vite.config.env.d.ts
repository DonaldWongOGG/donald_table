/* Minimal Node types for vite.config.ts */
declare module 'path' {
  function resolve(...parts: string[]): string;
  function dirname(p: string): string;
  const path: { resolve: typeof resolve; dirname: typeof dirname };
  export = path;
}

declare module 'url' {
  export function fileURLToPath(url: URL): string;
}

interface ImportMeta {
  url: string;
}
