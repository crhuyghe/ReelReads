import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist-react",
  },
  server: {
    port: 5123,
    strictPort: true,
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
