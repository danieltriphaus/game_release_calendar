import axios from "axios";
import { getIgdbAccessToken } from "../igdb/igdbAccessToken.js";

const query =
    'search "{query}";' +
    "fields name, first_release_date, cover.height, cover.width, cover.url, involved_companies.developer, involved_companies.company.name;" +
    "where involved_companies.developer = true; limit 5;";

export const getGameSearch = async (context, req, res) => {
    const accessToken = (await getIgdbAccessToken()).access_token;
    const response = await axios.post("https://api.igdb.com/v4/games", query.replace("{query}", req.query.q), {
        headers: {
            Accept: "application/json",
            "Content-Type": "text/plain",
            "Client-ID": process.env.IGDB_API_CLIENT_ID,
            Authorization: "Bearer " + accessToken,
        },
    });

    res.status(200).json(response.data);
};
