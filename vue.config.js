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
            // https: {
            //     key: fs.readFileSync(process.env.HTTPS_CERT_KEY),
            //     cert: fs.readFileSync(process.env.HTTPS_CERT),
            // },
            proxy: {
                "/api/": {
                    target: "http://localhost:3000/",
                    pathRewrite: { "^/api": "" },
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
