import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  define: {
    __API_URL__: process.env.VITE_API_URL,
  },
  base: "/",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3001,
  },
  preview: {
    port: 3001,
    strictPort: true
  }
});
