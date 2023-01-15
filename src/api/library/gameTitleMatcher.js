import { arePhrasesEquivalent } from "./arePhrasesEquivalent.js";

/**
 * @typedef {Object} GameTitleMatch
 * @property {TemporaryGameID} temporaryGameId
 * @property {number} igdbGameId
 */

/**
 * @param {TemporaryGame[]} temporaryGames
 * @returns
 */
export const gameTitleMatcher = (temporaryGames) => {
    /** @type {GameTitleMatch[]} */
    const matches = [];

    return {
        /**
         * @param {object[]} games
         */
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

        /**
         * @returns {GameTitleMatch[]}
         */
        getMatches() {
            return matches;
        },

        /**
         * @returns {TemporaryGame[]}
         */
        getUnmatchedTemporaryGames() {
            return temporaryGames.filter((temporaryGame) => isNotMatched(temporaryGame));
        },

        /**
         * @param {GameID[]} gameIds
         * @returns {GameID}
         */
        replaceTemporaryGameIds(gameIds) {
            return gameIds.map((gameId) => {
                return this.getMatchForTemporaryGameId(gameId) ?
                    this.getMatchForTemporaryGameId(gameId).igdbGameId
                    : gameId;
            });
        },

        /**
         * @param {GameID} gameId
         * @returns {GameTitleMatch}
         */
        getMatchForTemporaryGameId(gameId) {
            return matches.find((match) => match.temporaryGameId === gameId);
        },
    };

    /**
     * @param {TemporaryGame} temporaryGame
     * @returns {Boolean}
     */
    function isNotMatched(temporaryGame) {
        return !matches.find((match) => match.temporaryGameId === temporaryGame.id);
    }
};
