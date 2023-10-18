import { getGameList } from "../../datastore/getGameList.js";
import { upsertGameList } from "../../datastore/upsertGameList.js";

const GAME_VALIDATIONS = {
    id: { types: ["number", "string"], mandatory: true },
    platform: { key: "platform", types: ["number"], mandatory: false },
};

/**
 * @param {*} context
 * @param {Object} req
 * @param {Object} req.body
 * @param {UserGame[]} req.body.games
 * @param {*} res
 */
export const postUserGames = async (context, req, res) => {
    const userId = context.request.params.user_id;
    const listId = req.body.listId || "default";

    let gameList = await getGameList(userId, listId);

    const games = req.body.games;

    if (isValidRequest(req.body)) {
        if (!gameList) {
            gameList = { games: [] };
        }

        const addGames = games.filter((game) => gameList.games.find((gameListEntry) => gameListEntry.id === game.id) === undefined);
        gameList.games.push(...addGames);
        gameList.games.forEach((game, index) => {
            const replaceEntry = games.find((gameToAdd) => gameToAdd.id === game.id);
            if (replaceEntry) {
                gameList.games[index] = replaceEntry;
            }
        });

        await upsertGameList(userId, gameList.games, listId);

        res.status(200);
    } else {
        res.status(400);
    }

    res.end();
};


function isValidRequest(requestBody) {
    return isNotArrayAndNotString(requestBody)
        && hasGamesProperty(requestBody)
        && hasOnlyValidFields(requestBody.games)
        && hasMandatoryFields(requestBody.games)
        && fieldsAreValidType(requestBody.games);
}

/**
 * @param {UserGame[]} games
 * @returns {boolean}
 */
function hasOnlyValidFields(games) {
    return games.every((game) => {
        return Object.keys(game).every((key) => GAME_VALIDATIONS[key]);
    });
}

/**
 * @param {UserGame[]} games
 * @returns {boolean}
 */
function hasMandatoryFields(games) {
    return games.every((game) => {
        return Object.keys(GAME_VALIDATIONS).every((validationProperty) => {
            return GAME_VALIDATIONS[validationProperty].mandatory === false || GAME_VALIDATIONS[validationProperty].mandatory === true && game[validationProperty];
        });
    });
}

/**
 * @param {UserGame[]} games
 * @returns {boolean}
 */
function fieldsAreValidType(games) {
    return games.every((game) => {
        return Object.keys(game).every((key) => GAME_VALIDATIONS[key].types.find((type) => typeof game.id == type));
    });
}

/**
 * @param {Object} requestBody
 * @returns {boolean}
 */
function isNotArrayAndNotString(requestBody) {
    return !Array.isArray(requestBody) && typeof requestBody !== "string";
}

/**
 * @param {Object} requestBody
 * @returns {boolean}
 */
function hasGamesProperty(requestBody) {
    return requestBody.games;
}

