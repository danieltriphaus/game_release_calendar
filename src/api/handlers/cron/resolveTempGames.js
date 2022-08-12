import { getAllTemporaryGames } from "../../datastore/getTemporaryGames.js";
import { getGameListsContainingGameIds } from "../../datastore/getGameList.js";
import { convertFromDatastoreResult } from "../../datastore/convertFromDatastoreResult.js";
import { upsertGameList } from "../../datastore/upsertGameList.js";
import { getGamesWithMatchingTitle } from "../../igdb/getGamesWithMatchingTitle.js";

const gameTitleMatcher = (temporaryGames) => {
    const matchObject = {
        igdbGameId: 0,
        temporaryGameId: "",
    };

    return {
        matchAgainst(games) {},
        getMatches() {},
        getUnmatchedGameIds() {},
        replaceTemporaryGameIds(gameIds) {},
    };
};


export const resolveTempGames = async (context, req, res) => {
    const temporaryGames = convertFromDatastoreResult(await getAllTemporaryGames());
    const igdbGames = await getGamesWithMatchingTitle(temporaryGames.map((temporaryGame) => temporaryGame.name));

    const gtm = gameTitleMatcher(temporaryGames);
    gtm.match(igdbGames);

    const temporaryGameIds = temporaryGames.map((game) => game.id);
    const gameLists = convertFromDatastoreResult(await getGameListsContainingGameIds(temporaryGameIds));
    gameLists.forEach((gameList) => {
        gameList.games = gtm.replaceTemporaryGameIds(gameList.games);
        upsertGameList(gameList.userId, gameList.games, gameList.id);
    });

    res.json(igdbGames);
    res.end();
};