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
};
