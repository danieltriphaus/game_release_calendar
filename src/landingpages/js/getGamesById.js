const axios = require("axios");
const { getIgdbAccessToken } = require("../js/igdbAccessToken");
const { getAllGameLists, filterEventLists, convertFromDatastoreResult } = require("../js/datastore");

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

async function getGamesById(gameIds, accessToken) {
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

let eventListsGames = (async () => {
    const accessToken = await getIgdbAccessToken();
    const gameLists = await getAllGameLists(process.env.EVENT_USER_ID);
    const eventLists = convertFromDatastoreResult(filterEventLists(gameLists));

    const gameIds = eventLists.reduce((accumulator, currentValue) => {
        return [...accumulator, ...currentValue.games.map((game) => game.id)];
    }, []);

    const games = await getGamesById(gameIds, accessToken.access_token);

    return eventListsGames = eventLists.map((eventList) => {
        return {
            ...eventList,
            games: eventList.games.map((game) => {
                return games.find((gameData) => gameData.id === game.id);
            }),
        };
    });
})();


module.exports = {
    getGames: () => eventListsGames,
};

