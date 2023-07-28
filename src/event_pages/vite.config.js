import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import { resolve } from "path";
import pageData from "./pageData";


// https://vitejs.dev/config/
export default defineConfig({
    base: "/events/",
    plugins: [
        handlebars({
            context(pagePath) {
                return pageData[pagePath];
            },
            partialDirectory: resolve(__dirname, "partials"),
            helpers: {
                getDeveloper(game) {
                    return game.involved_companies ? game.involved_companies.find((company) => company.developer)?.company.name : "";
                },
                getReleaseDate(game) {
                    if (!game.first_release_date || !game.release_dates || !game.release_dates.length) {
                        return "TBD";
                    }

                    const releaseDate = game.release_dates.find((releaseDate) => releaseDate.date === game.first_release_date);

                    if (releaseDate.category === 0) {
                        const releaseDateObject = new Date(releaseDate.date * 1000);
                        return releaseDateObject.toLocaleDateString({ year: "numeric", month: "2-digit", day: "2-digit" });
                    } else {
                        return releaseDate.human;
                    }
                },
            },
        }),
    ],
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
        outDir: "../api/dist/events",
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                testEvent: resolve(__dirname, "/test-event/index.html"),
                tga2023: resolve(__dirname, "/the-game-awards-2023/index.html"),
            },
        },
    },
});
