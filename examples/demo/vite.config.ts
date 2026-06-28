/// <reference types="node" />

import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [react()],
  resolve: {
    alias: {
      "react-actionkit": fileURLToPath(new URL("../../src/index.ts", import.meta.url))
    }
  },
  server: {
    port: 5173
  }
});
