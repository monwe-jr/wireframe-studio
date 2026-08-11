import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@wireframe/core": fileURLToPath(
        new URL("../core/src/index.js", import.meta.url),
      ),
      "@wireframe/react": fileURLToPath(
        new URL("../react/src/index.js", import.meta.url),
      ),
    },
  },
});
