import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    base: "/landingpage/",
    server: {
        port: 8080,
        proxy: {
            "/api/": {
                target: "http://localhost:3000/",
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: "../api/dist/landingpage",
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                imprint: resolve(__dirname, "/imprint/index.html"),
                privacy: resolve(__dirname, "/privacy_notice/index.html"),
            },
        },
    },
    optimizeDeps: {
        include: ["./style.css"],
    },
});