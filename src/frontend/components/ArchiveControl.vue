<template>
    <b-button
        variant="primary"
        @click="onArchiveYear(2022)"
    >
        Archive 2022 Entries
    </b-button>

    <b-button
        variant="primary"
    >
        Archive all released Entries
    </b-button>

    <b-button
        variant="primary"
    >
        Archive Up To Date
    </b-button>
</template>

<script setup>

const props = defineProps(["games"]);

function onArchiveYear(year) {
    const gamesFromYear = props.games.filter((game) => {
        const selectedReleaseDate = getSelectedReleaseDate(game);

        return selectedReleaseDate
            && selectedReleaseDate <= (new Date(year + "-12-31T23:59:59")).getTime() / 1000
            && selectedReleaseDate >= (new Date(year + "-01-01T00:00:00")).getTime() / 1000;
    });

    console.log(gamesFromYear);
}

function getSelectedReleaseDate(game) {
    let selectedReleaseDate;
    if (game.selectedPlatform) {
        selectedReleaseDate = game.release_dates.find((releaseDate) => releaseDate.platform.id === game.selectedPlatform);
    } else {
        selectedReleaseDate = game.release_dates.find((date) => date.date === game.first_release_date);
    }
    return selectedReleaseDate.date;
}
</script>