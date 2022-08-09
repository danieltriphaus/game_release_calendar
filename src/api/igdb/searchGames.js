import axios from "axios";

const query = "search \"{query}\"; fields {fields}; where involved_companies.developer = true; limit 5;";

export const searchGames = async (searchQuery, accessToken, fields) => {
    const finalQuery = query.replace("{fields}", fields.join(","));

    const response = await axios.post("https://api.igdb.com/v4/games", finalQuery.replace("{query}", searchQuery), {
        headers: {
            Accept: "application/json",
            "Content-Type": "text/plain",
            "Client-ID": process.env.IGDB_API_CLIENT_ID,
            Authorization: "Bearer " + accessToken,
        },
    });

    return response.data;
};
