const EleventyVitePlugin = require("@11ty/eleventy-plugin-vite");
require('dotenv').config();

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPlugin(EleventyVitePlugin);

    eleventyConfig.addShortcode("getDeveloper", function (game) {
        return game.involved_companies ? game.involved_companies.find((company) => company.developer)?.company?.name : "";
    });

    eleventyConfig.addShortcode("getReleaseDate", function (game) {
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
    });
}