<template>
    <b-button
        variant="primary"
        @click="onArchiveYear(2022)"
    >
        Archive 2022 Entries
    </b-button>

    <b-button
        variant="primary"
        @click="onArchiveAllReleased"
    >
        Archive all released Entries
    </b-button>

    <!-- <b-button
        variant="primary"
    >
        Archive Up To Date
    </b-button> -->
</template>

<script setup>
import axios from "axios";
import { apiClient } from "../library/apiClient";
import { inject } from "vue";

const user = inject("user");
const emits = defineEmits(["delete-game"]);

const props = defineProps({
    games: {
        type: Array,
        default: () => [],
    },
});

/**
 * @param {number} year
 */
async function onArchiveYear(year) {
    const gamesFromYear = props.games.filter((game) => {
        const selectedReleaseDate = getSelectedReleaseDate(game);

        return selectedReleaseDate
            && selectedReleaseDate <= (new Date(year + "-12-31T23:59:59")).getTime() / 1000
            && selectedReleaseDate >= (new Date(year + "-01-01T00:00:00")).getTime() / 1000;
    });

    await archiveGames(gamesFromYear);
}

async function onArchiveAllReleased() {
    const releasedGames = props.games.filter((game) => {
        const selectedReleaseDate = getSelectedReleaseDate(game);
        return selectedReleaseDate && selectedReleaseDate <= (new Date()).getTime() / 1000;
    });

    await archiveGames(releasedGames);
}

/**
 * @param {object} game
 * @returns {Date}
 */
function getSelectedReleaseDate(game) {
    let selectedReleaseDate;
    if (game.selectedPlatform) {
        selectedReleaseDate = game.release_dates.find((releaseDate) => releaseDate.platform.id === game.selectedPlatform);
    } else {
        selectedReleaseDate = game.release_dates.find((date) => date.date === game.first_release_date);
    }
    return selectedReleaseDate.date;
}

/**
 * @param {object[]} games
 */
async function archiveGames(games) {
    const userGames = games.map((game) => {
        return {
            id: game.id,
        };
    });

    await Promise.all([
        apiClient.user(user.value.id).games.post(userGames, "archive"),
        axios.delete("/api/user/" + user.value.id + "/games", { data: { games: userGames, listId: "default" } }),
    ]);

    emits("delete-game");
}
</script>