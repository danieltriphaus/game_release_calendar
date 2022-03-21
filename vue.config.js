const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        entry: {
            app: ["./src/frontend/main.js"],
        },
        devServer: {
            hot: true,
            allowedHosts: "all",
            proxy: {
                "/api/": {
                    target: "http://localhost:3000/",
                    logLevel: "debug",
                    changeOrigin: true,
                },
            },
        },
    },
    pages: {
        index: {
            entry: "./src/frontend/main.js",
        },
    },
});
