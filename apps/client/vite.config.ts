import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const serverUrl = env.VITE_SERVER_URL || "http://localhost:3001";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@creative/shared": fileURLToPath(
          new URL("../../packages/shared/src/index.ts", import.meta.url),
        ),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: serverUrl,
          changeOrigin: true,
        },
      },
    },
  };
});
