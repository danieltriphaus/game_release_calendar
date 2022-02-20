module.exports = {
    preset: "@vue/cli-plugin-unit-jest",
};

process.env = Object.assign(process.env, {
    API_KEY: "test_api_key",
});
