// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // SPA mode: client-side only, no SSR. Shell prerendered as index.html.
    spa: {
      enabled: true,
      prerender: { outputPath: "/" },
    },
    server: { entry: "server" },
  },
  // Static build for plain-static hosting (Timeweb App Platform "React").
  // Outputs prerendered SPA to ./dist.
  nitro: {
    preset: "static",
    output: {
      dir: ".output",
      publicDir: "dist",
    },
  },
});
