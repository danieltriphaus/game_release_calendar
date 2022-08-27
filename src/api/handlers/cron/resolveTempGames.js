import { getAllTemporaryGames } from "../../datastore/getTemporaryGames.js";
import { getGameListsContainingGameIds, getKeyFromDatastoreEntity } from "../../datastore/getGameList.js";
import { convertFromDatastoreResult } from "../../datastore/convertFromDatastoreResult.js";
import { upsertGameList } from "../../datastore/upsertGameList.js";
import { getGamesWithMatchingTitle as getIgdbGamesWithMatchingTitle } from "../../igdb/getGamesWithMatchingTitle.js";
import { gameTitleMatcher } from "../../library/gameTitleMatcher.js";
import { upsertGame } from "../../datastore/upsertGame.js";

export const resolveTempGames = async (context, req, res) => {
    const temporaryGames = convertFromDatastoreResult(await getAllTemporaryGames());
    const igdbGames = await getIgdbGamesWithMatchingTitle(temporaryGames.map((temporaryGame) => temporaryGame.name));

    const temporaryGameIds = temporaryGames.map((game) => game.id);
    const gameLists = await getGameListsContainingGameIds(temporaryGameIds, req.query.userId);

    const gtm = gameTitleMatcher(temporaryGames);
    gtm.matchAgainst(igdbGames);

    gameLists.forEach(async (gameList) => {
        const key = getKeyFromDatastoreEntity(gameList);
        gameList.games = gtm.replaceTemporaryGameIds(gameList.games);
        await upsertGameList(key.parent, gameList.games, key.id);
    });

    const matches = gtm.getMatches().map((match) => {
        return {
            ...match,
            igdbTitle: igdbGames.find((igdbGame) => igdbGame.id === match.igdbGameId).name,
            temporaryTitle: temporaryGames.find((temporaryGame) => temporaryGame.id === match.temporaryGameId).name,
        };
    });

    temporaryGames.forEach(async (temporaryGame) => {
        if (gtm.getMatches().find((match) => match.temporaryGameId === temporaryGame.id)) {
            temporaryGame.matched = new Date();
            await upsertGame(temporaryGame);
        }
    });

    res.json({ matches, unmatched: gtm.getUnmatchedTemporaryGames(), foundIgdbGames: igdbGames });
    res.end();
};