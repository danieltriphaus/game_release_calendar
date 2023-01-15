import axios from "axios";
import { getIgdbAccessToken } from "./igdbAccessToken.js";
/**
 * @module igdb/getGamesWithMatchingTitle
 */


//ToDo: Refactor
/**
 * Builds query for IGDB search endpoint and converts given titles for better searchability
 * @param {string[]} titlesToMatch
 * @returns {IGDBQuery}
 */
export const getFullQuery = (titlesToMatch) => {
    const query = "fields id, name; where {where}; limit 500;";
    const queryWhereTemplate = "name ~ *\"{title}\"*";
    const queryWhereSeperator = " | ";

    const titlesWithoutFillWords = titlesToMatch.map((title) => {
        if (/\b(the|and|or|of)\b/g.test(title)) {
            return title
                .replace(/\b(the|and|or|of)\b/g, "")
                .replace(/\s+/g, " ");
        }
    }).filter((title) => title);

    const titlesWitoutSpecialChars = titlesToMatch.map((title) => {
        if ((new RegExp("[^a-zA-Z0-9 ]")).test(title)) {
            return title
                .replace(new RegExp("[^a-zA-Z0-9 ]"), "")
                .replace(/\s+/g, " ");
        }
    }).filter((title) => title);

    const titlesExtended = [...titlesToMatch, ...titlesWithoutFillWords, ...titlesWitoutSpecialChars];

    const queryWhere = titlesExtended.reduce((where, title, index) => {
        return where.concat(queryWhereTemplate.replace("{title}", title.trim()), index + 1 < titlesExtended.length ? queryWhereSeperator : "");
    }, "");

    return query.replace("{where}", queryWhere);
};

/**
 * @param {string[]} titlesToMatch
 * @returns {IGDBGameAPIResponse}
 */
export const getGamesWithMatchingTitle = async (titlesToMatch) => {
    const finalQuery = getFullQuery(titlesToMatch);

    const accessToken = await getIgdbAccessToken();

    const response = await axios.post("https://api.igdb.com/v4/games", finalQuery, {
        headers: {
            Accept: "application/json",
            "Content-Type": "text/plain",
            "Client-ID": process.env.IGDB_API_CLIENT_ID,
            Authorization: "Bearer " + accessToken.access_token,
        },
    });

    if (response.status === 200 && response.data) {
        return response.data;
    }
};


