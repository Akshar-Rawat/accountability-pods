import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/test/setup.js"],
    fileParallelism: false, // Ensure tests run sequentially to avoid port/DB collision if any
    hookTimeout: 30000,
  },
});
