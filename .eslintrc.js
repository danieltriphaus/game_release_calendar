module.exports = {
    root: true,
    env: {
        node: true,
        es2021: true,
        "vue/setup-compiler-macros": true,
        "cypress/globals": true,
    },
    extends: ["plugin:vue/vue3-essential", "eslint:recommended", "plugin:vue/base"],
    plugins: ["cypress"],
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "vue/html-indent": ["warn", 4],
        "vue/script-setup-uses-vars": "error",
    },
    overrides: [
        {
            files: ["**/__tests__/*.{j,t}s?(x)", "**/tests/unit/**/*.spec.{j,t}s?(x)"],
            env: {
                jest: true,
            },
        },
    ],
};
