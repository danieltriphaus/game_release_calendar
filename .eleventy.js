const EleventyVitePlugin = require("@11ty/eleventy-plugin-vite");
require('dotenv').config();

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPlugin(EleventyVitePlugin);
}