import { getGameList } from "../../datastore/getGameList.js";
import { upsertGameList } from "../../datastore/upsertGameList.js";

const GAME_VALIDATIONS = {
    id: { types: ["number", "string"], mandatory: true },
    platform: { key: "platform", types: ["number"], mandatory: false },
};

export const postUserGames = async (context, req, res) => {
    const userId = context.request.params.user_id;

    const gameList = await getGameList(userId);

    const games = req.body;

    if (hasOnlyValidFields(games) && hasMandatoryFields(games) && fieldsAreValidType(games)) {
        if (gameList) {
            gameList.games.forEach((gameListEntry) => {
                if (!games.find((game) => gameListEntry.id === game.id)) {
                    games.push(JSON.parse(JSON.stringify(gameListEntry)));
                }
            });
        }

        await upsertGameList(userId, games, "default");

        res.status(200);
    } else {
        res.status(400);
    }

    res.end();
};

function hasOnlyValidFields(games) {
    return games.every((game) => {
        return Object.keys(game).every((key) => GAME_VALIDATIONS[key]);
    });
}

function hasMandatoryFields(games) {
    return games.every((game) => {
        return Object.keys(GAME_VALIDATIONS).every((validationProperty) => {
            return GAME_VALIDATIONS[validationProperty].mandatory === false || GAME_VALIDATIONS[validationProperty].mandatory === true && game[validationProperty];
        });
    });
}

function fieldsAreValidType(games) {
    return games.every((game) => {
        return Object.keys(game).every((key) => GAME_VALIDATIONS[key].types.find((type) => typeof game.id == type));
    });
}

