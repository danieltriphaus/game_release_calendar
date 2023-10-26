const axios = require("axios");

const displayFields = [
    "name",
    "first_release_date",
    "url",
    "release_dates.category",
    "release_dates.human",
    "release_dates.date",
    "release_dates.platform.id",
    "release_dates.platform.abbreviation",
    "release_dates.platform.alternative_name",
    "release_dates.platform.name",
    "cover.height",
    "cover.width",
    "cover.url",
    "involved_companies.developer",
    "involved_companies.company.name",
];

const query = "fields {fields}; where id = ({gameIds}); limit 500;";


module.exports = {
    getGamesById: async (gameIds, accessToken) => {
        if (!gameIds || gameIds.length === 0) {
            return [];
        }

        const gameIdsString = gameIds.join(",");

        const finalQuery = query.replace("{fields}", displayFields.join(","));

        const response = await axios.post("https://api.igdb.com/v4/games", finalQuery.replace("{gameIds}", gameIdsString), {
            headers: {
                Accept: "application/json",
                "Content-Type": "text/plain",
                "Client-ID": process.env.IGDB_API_CLIENT_ID,
                Authorization: "Bearer " + accessToken,
            },
        });

        return response.data;
    }
}

