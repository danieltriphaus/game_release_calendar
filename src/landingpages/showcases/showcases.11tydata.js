const { getIgdbAccessToken } = require("../js/igdbAccessToken");
const { getGamesById } = require("../js/getGamesById");
const { getAllGameLists, filterEventLists, convertFromDatastoreResult } = require("../js/datastore");


module.exports = async function () {
    const accessToken = await getIgdbAccessToken();
    const gameLists = await getAllGameLists(process.env.EVENT_USER_ID);
    const eventLists = convertFromDatastoreResult(filterEventLists(gameLists));

    const gameIds = eventLists.reduce((accumulator, currentValue) => {
        return [...accumulator, ...currentValue.games.map((game) => game.id)];
    }, []);

    const games = await getGamesById(gameIds, accessToken.access_token);

    const eventListsGames = eventLists.map((eventList) => {
        return {
            ...eventList,
            games: eventList.games.map((game) => {
                return games.find((gameData) => gameData.id === game.id);
            }),
        };
    });

    // console.log(eventListsGames);

    const showcases = {
        sop: [{
            listId: "SoP202309",
            title: "Sony State of Play September 2023 - New looks at Final Fantasy VII Rebirth, Resident Evil 4 VR Mode, Avatar:Frontiers of Pandora and many more.",
            headline: "Sony State of Play September 2023 <br> All announcements from the showcase",
            description: "New looks at Final Fantasy VII Rebirth, Resident Evil 4 VRMode, Avatar: Frontiers of Pandora and every other announcement on one page",
            additional_info: "For all the trailers and more Info check out <a href='https://blog.playstation.com/2023/09/14/state-of-play-september-2023-all-trailers-and-complete-recap/' target='_blank'>the official Post on the Playstation Blog</a>",
            name: "september-2023",
            games: []
        }]

    }

    // console.log(eventListsGames.find((eventList) => eventList.id === "SoP202309").games);

    Object.keys(showcases).forEach((showcaseId) => {
        showcases[showcaseId][0].games = eventListsGames.find((eventList) => eventList.id === showcases[showcaseId][0].listId).games;
    });


    return showcases;
}

