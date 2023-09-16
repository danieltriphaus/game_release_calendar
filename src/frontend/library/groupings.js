import { getSelectedReleaseDate } from "./releaseDate.js";

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {number} key
 * @property {string} heading
 *
 * @typedef {Category[]} Grouping
 */

/**
 * @type {string}
 */
let defaultGrouping = "released_unreleased";

/**
 * @param {*} gameAssignments
 * @returns {Grouping}
 */
export const getDefaultGrouping = () => {
    return defaultGrouping;
};

/**
 * @param {string} grouping
 */
export const setDefaultGrouping = (grouping) => {
    defaultGrouping = grouping;
};

export const getCurrentCategories = (currentGrouping, sortedGames) => {
    const categories = config.groupings[currentGrouping];

    const initialValue = {};

    categories.forEach((category) => {
        initialValue[category.id] = [];
    });

    const categoriesMap = sortedGames.reduce(config.sorting[currentGrouping](), initialValue);

    categories.forEach((category) => {
        category.games = categoriesMap[category.id];
    });

    return categories.filter((category) => category.games.length > 0);
};


function releasedUnreleased() {
    return (categoriesMap, game) => {
        if (!game.release_dates || !game.release_dates.length) {
            categoriesMap["unreleased-games"].push(game);
        } else {
            const selectedReleaseDate = getSelectedReleaseDate(game);
            const releaseDate = new Date(selectedReleaseDate.date * 1000);

            if (releaseDate <= new Date()) {
                categoriesMap["released-games"].push(game);
            } else {
                categoriesMap["unreleased-games"].push(game);
            }
        }
        return categoriesMap;
    };
}

function monthly() {
    const currentYear = new Date().getFullYear();
    return (categoriesMap, game) => {
        const selectedReleaseDate = getSelectedReleaseDate(game);
        const releaseDate = new Date(selectedReleaseDate.date * 1000);

        if (selectedReleaseDate.category === 2 && releaseDate.getFullYear() === currentYear) {
            const categoryID = `year-${releaseDate.getFullYear()}`;
            categoriesMap[categoryID].push(game);
        } else if (selectedReleaseDate.category === 7) {
            categoriesMap["tbd"].push(game);
        } else if (releaseDate.getFullYear() < currentYear) {
            categoriesMap["past"].push(game);
        } else if (releaseDate.getFullYear() > currentYear) {
            categoriesMap["future"].push(game);
        } else {
            const month = releaseDate.toLocaleString("en", { month: "long" }).toLowerCase();
            categoriesMap[month].push(game);
        }
        return categoriesMap;
    };
}

export const config = {
    "default": "released_unreleased",
    /**
	 * @type {Grouping[]}
	 */
    sorting: {
        "released_unreleased": releasedUnreleased,
        "months": monthly,
    },
    "groupings": {
        /**
		 * @type {Grouping}
		 */
        "released_unreleased": [
            {
                "id": "released-games",
                "key": 1,
                "heading": "Released Games",
            },
            {
                "id": "unreleased-games",
                "key": 2,
                "heading": "Unreleased Games",
            },
        ],
        /**
		 * @type {Grouping}
		 */
        "months": [
            {
                id: "past",
                key: 0,
                heading: "Past",
            },
            {
                "id": "january",
                "key": 1,
                "heading": "January",
            },
            {
                "id": "february",
                "key": 2,
                "heading": "February",
            },
            {
                "id": "march",
                "key": 3,
                "heading": "March",
            },
            {
                "id": "april",
                "key": 4,
                "heading": "April",
            },
            {
                "id": "may",
                "key": 5,
                "heading": "May",
            },
            {
                "id": "june",
                "key": 6,
                "heading": "June",
            },
            {
                "id": "july",
                "key": 7,
                "heading": "July",
            },
            {
                "id": "august",
                "key": 8,
                "heading": "August",
            },
            {
                "id": "september",
                "key": 9,
                "heading": "September",
            },
            {
                "id": "october",
                "key": 10,
                "heading": "October",
            },
            {
                "id": "november",
                "key": 11,
                "heading": "November",
            },
            {
                "id": "december",
                "key": 12,
                "heading": "December",
            },
            {
                "id": "year-" + new Date().getFullYear(),
                "key": 13,
                "heading": new Date().getFullYear()
                    .toString(),
            },
            {
                "id": "future",
                "key": 14,
                "heading": new Date(new Date().getFullYear() + 1, 1, 1).getFullYear()
                    .toString() + " and beyond",
            },
            {
                id: "tbd",
                key: 15,
                heading: "TBD",
            },
        ],
    },
};
