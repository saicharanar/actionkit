import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      rollupTypes: true
    })
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "ActionKit",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs")
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "react-dom"]
    }
  },
  test: {
    environment: "jsdom",
    globals: true
  }
});
