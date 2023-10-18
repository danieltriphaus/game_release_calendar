import { getAllTemporaryGames } from "../../datastore/getTemporaryGames.js";
import { getAllGameLists } from "../../datastore/getGameList.js";
import { convertFromDatastoreResult, getKeyFromDatastoreEntity } from "../../datastore/convertFromDatastoreResult.js";
import { upsertGameList } from "../../datastore/upsertGameList.js";
import { getGamesWithMatchingTitle as getIgdbGamesWithMatchingTitle } from "../../igdb/getGamesWithMatchingTitle.js";
import { gameTitleMatcher } from "../../library/gameTitleMatcher.js";
import { upsertGame } from "../../datastore/upsertGame.js";

export const resolveTempGames = async (context, req, res) => {
    const temporaryGames = convertFromDatastoreResult(await getAllTemporaryGames());

    if (temporaryGames.length === 0) {
        res.status(200).json({ message: "No temporary games to resolve" });
        return;
    }

    const gameLists = await getAllGameLists(req.query.userId, true);
    const gameListGames = gameLists.map((gameList) => gameList.games).flat();
    const relevantTemporaryGames = temporaryGames.filter((temporaryGame) => gameListGames.find((game) => game.id === temporaryGame.id));

    if (relevantTemporaryGames.length === 0) {
        res.status(200).json({ message: "No relevant temporary games to resolve" });
        return;
    }

    const igdbGames = await getIgdbGamesWithMatchingTitle(relevantTemporaryGames.map((temporaryGame) => temporaryGame.name));

    const gtm = gameTitleMatcher(temporaryGames);
    gtm.matchAgainst(igdbGames);

    gameLists.forEach(async (gameList) => {
        const key = getKeyFromDatastoreEntity(gameList);
        const gameIds = gtm.replaceTemporaryGameIds(gameList.games.map((game) => game.id));
        gameList.games = gameIds.map((gameId) => {
            return {
                id: gameId,
            };
        });
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