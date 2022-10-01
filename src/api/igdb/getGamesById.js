import axios from "axios";

const query = "fields {fields}; where id = ({gameIds}); limit 500;";

export const getGamesById = async (gameIds, accessToken, fields) => {
    if (!gameIds || gameIds.length === 0) {
        return [];
    }

    const gameIdsString = gameIds.join(",");

    const finalQuery = query.replace("{fields}", fields.join(","));

    const response = await axios.post("https://api.igdb.com/v4/games", finalQuery.replace("{gameIds}", gameIdsString), {
        headers: {
            Accept: "application/json",
            "Content-Type": "text/plain",
            "Client-ID": process.env.IGDB_API_CLIENT_ID,
            Authorization: "Bearer " + accessToken,
        },
    });

    return response.data;
};
