<template>
    <div>
        <b-button
            variant="primary"
            data-test="archive-year-2022"
            @click="onArchiveYear(2022)"
        >
            Archive 2022 Entries
        </b-button>

        <b-button
            variant="primary"
            data-test="archive-released"
            @click="onArchiveAllReleased"
        >
            Archive all released Entries
        </b-button>

        <!-- <b-button
        variant="primary"
    >
        Archive Up To Date
    </b-button> -->
        <b-button
            variant="primary"
            @click="changeGameListId('archive')"
        >
            Show Archive
        </b-button>
    </div>
</template>

<script setup>
import { apiClient } from "../../library/apiClient";
import { inject, computed } from "vue";

const user = inject("user");
const emits = defineEmits(["delete-game", "show-archive"]);
const { gameListId, changeGameListId } = inject("gameListId");

const props = defineProps({
    games: {
        type: Array,
        default: () => [],
    },
});

const archivableGames = computed(() => {
    return props.games.filter((game) => game.release_dates && game.release_dates.length > 0);
});

/**
 * @param {number} year
 */
async function onArchiveYear(year) {
    const gamesFromYear = archivableGames.value.filter((game) => {
        const selectedReleaseDate = getSelectedReleaseDate(game);

        return selectedReleaseDate
            && selectedReleaseDate <= (new Date(year + "-12-31T23:59:59")).getTime() / 1000
            && selectedReleaseDate >= (new Date(year + "-01-01T00:00:00")).getTime() / 1000;
    });

    await archiveGames(gamesFromYear);
}

async function onArchiveAllReleased() {
    const releasedGames = archivableGames.value.filter((game) => {
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
        apiClient.user(user.value.id).games.delete(userGames, gameListId.value),
    ]);

    emits("delete-game");
}
</script>