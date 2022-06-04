import axios from "axios";
import { getIgdbAccessToken } from "../igdb/igdbAccessToken.js";
import { displayFields } from "../igdb/gamesFieldLists.js";

const query = 'search "{query}";' + "fields {fields}; where involved_companies.developer = true; limit 5;";

export const getGameSearch = async (context, req, res) => {
    const accessToken = (await getIgdbAccessToken()).access_token;

    const finalQuery = query.replace("{fields}", displayFields.join(","));

    const response = await axios.post("https://api.igdb.com/v4/games", finalQuery.replace("{query}", req.query.q), {
        headers: {
            Accept: "application/json",
            "Content-Type": "text/plain",
            "Client-ID": process.env.IGDB_API_CLIENT_ID,
            Authorization: "Bearer " + accessToken,
        },
    });

    res.status(200).json(response.data);
};
