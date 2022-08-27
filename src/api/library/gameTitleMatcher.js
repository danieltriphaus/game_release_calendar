import { arePhrasesEquivalent } from "./arePhrasesEquivalent.js";

export const gameTitleMatcher = (temporaryGames) => {
    const matches = [];

    return {
        matchAgainst(games) {
            temporaryGames.forEach((temporaryGame) => {
                const matchedGame = games.find((game) => arePhrasesEquivalent([temporaryGame.name, game.name]) && isNotMatched(temporaryGame));
                if (matchedGame) {
                    matches.push({
                        temporaryGameId: temporaryGame.id,
                        igdbGameId: matchedGame.id,
                    });
                }
            });
        },

        getMatches() {
            return matches;
        },

        getUnmatchedTemporaryGames() {
            return temporaryGames.filter((temporaryGame) => isNotMatched(temporaryGame));
        },

        replaceTemporaryGameIds(gameIds) {
            return gameIds.map((gameId) => {
                return this.getMatchForTemporaryGameId(gameId) ?
                    this.getMatchForTemporaryGameId(gameId).igdbGameId
                    : gameId;
            });
        },

        getMatchForTemporaryGameId(gameId) {
            return matches.find((match) => match.temporaryGameId === gameId);
        },
    };

    function isNotMatched(temporaryGame) {
        return !matches.find((match) => match.temporaryGameId === temporaryGame.id);
    }
};
