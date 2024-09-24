import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["src/assets/**/*.woff2", "src/assets/**/*.ttf", "src/assets/**/*.otf"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
