module.exports = {
    root: true,
    env: {
        node: true,
        "vue/setup-compiler-macros": true,
    },
    extends: ["plugin:vue/vue3-essential", "eslint:recommended", "plugin:vue/base"],
    parserOptions: {
        parser: "@babel/eslint-parser",
    },
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
