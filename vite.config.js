import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import viteCompression from "vite-plugin-compression";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/app/",
    plugins: [vue(), viteCompression()],
    server: {
        port: 8080,
        proxy: {
            "/api/": {
                target: "http://localhost:3000/",
                changeOrigin: true,
            },
        },
    },
    resolve: {
        extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        outDir: "src/api/dist/frontend",
    },
});
