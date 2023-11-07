process.env = Object.assign(process.env, {
    API_KEY: "test_api_key",
    VUE_APP_DEFAULT_USER: "y1xx",
});
module.exports = {
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    testMatch: ["**/tests/unit/**/*.spec.js"],
    setupFilesAfterEnv: ["./tests/unit/setup.js"],
    transform: {
        "\\.[jt]sx?$": "babel-jest",
        "^.+\\.vue$": "@vue/vue3-jest",
    },
    testEnvironment: "jsdom",
    collectCoverageFrom: [
        "src/**/*.{js,vue}",
        "src/frontend/**/*.{js,vue}",
        "!src/api/datastore/**",
        "src/api/datastore/convertFromDatastoreResult.js",
        "!src/frontend/router/index.js",
        "!src/api/app.js",
        "!src/api/library/types.js",
        "!src/frontend/main.js",
        "!src/api/views/**"],
    globals: {
        "@vue/vue3-jest": {
            babelConfig: true,
        },
        caches: {
            open() {
                return {
                    put: () => {},
                    match: () => {},
                    delete: () => {},
                };
            },
        },
    },
};
