<template>
    <div>
        <b-tabs
            end
            fill
            pills
        >
            <b-tab
                active
                title-link-class="link-secondary"
                :title-link-attributes="{ title: 'Search Games' }"
            >
                <template #title>
                    <i class="bi bi-search" />
                </template>
                <game-search @game-added="onGameAdded" />
            </b-tab>
            <b-tab
                title-link-class="link-secondary temporary-game-tab"
                :title-link-attributes="{ title: 'Game not Found?'}"
            >
                <template #title>
                    <i class="bi bi-plus-square" />
                </template>
                <add-temporary-game @game-added="onGameAdded" />
            </b-tab>
            <b-tab
                title-link-class="link-secondary calendar-tab"
                :title-link-attributes="{ title: 'Get Calendar' }"
            >
                <template #title>
                    <i class="bi bi-calendar2-week" />
                </template>
                <calendar-control />
            </b-tab>
            <b-tab
                title-link-class="link-secondary archive-tab"
                :title-link-attributes="{ title: 'Archive Entries' }"
            >
                <template #title>
                    <i class="bi bi-archive" />
                </template>
                <archive-control
                    :games="games"
                    @delete-game="populateGameList"
                />
            </b-tab>
        </b-tabs>
    </div>
    <base-collapsable
        v-for="category in categories"
        :key="category.key"
        :collapse-id="category.id"
        :heading="category.heading"
    >
        <div
            v-for="game in category.games"
            :key="game.id"
            class="row"
            :data-cy="category.id"
        >
            <game-list-item
                :game="game"
                @delete-game="deleteGame"
                @platform-selected="onPlatformSelected"
            />
        </div>
    </base-collapsable>
</template>

<script setup>
import GameSearch from "./GameSearch.vue";
import GameListItem from "./GameListItem.vue";
import AddTemporaryGame from "./AddTemporaryGame.vue";
import CalendarControl from "../components/CalendarControl.vue";
import BaseCollapsable from "./BaseCollapsable.vue";
import ArchiveControl from "./ArchiveControl.vue";

import { onMounted, ref, computed, inject, reactive } from "vue";
import { apiClient } from "../library/apiClient";

const user = inject("user");

const emits = defineEmits(["loading", "loading-complete"]);

const props = defineProps({
    userId: {
        type: String,
        default: "",
    },
    gameListId: {
        type: String,
        default: "default",
    },
});

const games = ref([]);

/**
 * @async
 * @function populateGameList
 */
async function populateGameList() {
    emits("loading");
    games.value = await apiClient.user(props.userId).games.get();
    emits("loading-complete");
}

onMounted(async () => {
    await populateGameList();
});

function onGameAdded(game) {
    games.value.push(game);
}

async function deleteGame(id) {
    await apiClient.user(user.value.id).games.delete([{ id }]);
    populateGameList();
}

/**
 * @param {UserGame} game
 * @param {PlatformID} platform
 */
function onPlatformSelected(gameId, platform) {
    games.value.find((game) => game.id === gameId).selectedPlatform = platform;
}

const sortedGames = computed(() => {
    const gamesCopy = [...games.value];

    return gamesCopy.sort((a, b) => {
        let selectedReleaseDateA = a.release_dates ? getSelectedReleaseDate(a) : undefined;
        let selectedReleaseDateB = b.release_dates ? getSelectedReleaseDate(b) : undefined;

        if (selectedReleaseDateA < selectedReleaseDateB || !selectedReleaseDateB) {
            return -1;
        }
        if (selectedReleaseDateA > selectedReleaseDateB || !selectedReleaseDateA) {
            return 1;
        }
        if (selectedReleaseDateA === selectedReleaseDateB) {
            return 0;
        }
    });
});

const releasedGames = computed(() => {
    return sortedGames.value.filter((game) => {
        return game.release_dates && new Date(getSelectedReleaseDate(game) * 1000) <= new Date();
    });
});

const unreleasedGames = computed(() => {
    return sortedGames.value.filter((game) => {
        return !game.release_dates || new Date(getSelectedReleaseDate(game) * 1000) > new Date() || !game.first_release_date;
    });
});

const categories = reactive([
    {
        id: "released-games",
        key: 1,
        heading: "Released Games",
        games: releasedGames,
    },
    {
        id: "unreleased-games",
        key: 2,
        heading: "Unreleased Games",
        games: unreleasedGames,
    },
]);

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

<style scoped>
    .game {
        display: flex;
    }

    .border {
        border-bottom: 1px;
        border-bottom-color: black;
    }
</style>