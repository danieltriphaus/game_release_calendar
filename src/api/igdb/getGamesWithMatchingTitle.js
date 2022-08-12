import axios from "axios";
import { getIgdbAccessToken } from "./igdbAccessToken.js";

export const getFullQuery = (titlesToMatch) => {
    const query = "fields id, name; where {where}; limit 500;";
    const queryWhereTemplate = "name ~ *\"{title}\"*";
    const queryWhereSeperator = " | ";

    const queryWhere = titlesToMatch.reduce((where, title, index) => {
        return where.concat(queryWhereTemplate.replace("{title}", title.trim()), index + 1 < titlesToMatch.length ? queryWhereSeperator : "");
    }, "");

    return query.replace("{where}", queryWhere);
};

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


