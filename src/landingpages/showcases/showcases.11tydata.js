const { getGames } = require("../js/getGamesById");

const showcases = {
    sop: [{
        listId: "SoP202309",
        title: "Sony State of Play September 2023 <br> All announcements from the showcase",
        meta_description: "New looks at Final Fantasy VII Rebirth, Resident Evil 4 VRMode, Avatar: Frontiers of Pandora and every other announcement on one page",
        headline: "Sony State of Play September 2023 <br> All announcements from the showcase",
        description: "New looks at Final Fantasy VII Rebirth, Resident Evil 4 VRMode, Avatar: Frontiers of Pandora and every other announcement on one page",
        additional_info: "For all the trailers and more Info check out <a href='https://blog.playstation.com/2023/09/14/state-of-play-september-2023-all-trailers-and-complete-recap/' target='_blank'>the official Post on the Playstation Blog</a>",
        name: "september-2023",
        games: [],
    }],
    sgf: [{
        listId: "SGF2023",
        title: "Summer Game Fest 2023 All announcements from the showcase",
        meta_description: "The show features the world gameplay premiere of MORTAL KOMBAT 1 with Ed Boon, as well as a look at the gameplay of ALAN WAKE 2 with Sam Lake...",
        headline: "Summer Game Fest 2023 <br> All announcements from the showcase",
        description: "The show features the world gameplay premiere of MORTAL KOMBAT 1 with Ed Boon, as well as a look at the gameplay of ALAN WAKE 2 with Sam Lake from Remedy, plus more game news and announcements including the world premiere of FortniteWilds the new season of Fortnite launching Friday. Announcements from FINAL FANTASY VII: REBIRTH, PRINCE OF PERSIA: THE LOST CROWN, a surprise appearance by Nicolas Cage and more!",
        additional_info: "<p>For all the trailers check out <a href='https://www.youtube.com/watch?v=QDXcGEo1TfU' target='_blank'>the offical VoD</a></p>",
        name: "2023",
        games: [],
    }],
};

module.exports = async function () {
    const eventListsGames = await getGames();

    Object.keys(showcases).forEach((showcaseId) => {
        showcases[showcaseId][0].games = eventListsGames.find((eventList) => eventList.id === showcases[showcaseId][0].listId).games;
    });

    return showcases;
};

