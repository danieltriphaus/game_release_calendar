<template>
    <div>
        <game-search @game-added="onGameAdded" />

        <game-list-menu
            :games="games"
            @game-added="onGameAdded"
            @delete-game="populateGameList"
            @change-grouping="setGrouping"
        />
    </div>
    <div>
        <template v-if="categories.length > 0">
            <base-collapsable
                v-for="category in categories"
                :key="category.id"
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
    </div>
</template>

<script setup>
import GameSearch from "./GameSearch.vue";
import GameListItem from "./GameListItem.vue";
import BaseCollapsable from "./BaseCollapsable.vue";
import GameListMenu from "./GameListMenu.vue";
import { getDefaultGrouping, getCurrentCategories } from "../library/groupings";
import { getSelectedReleaseDate } from "../library/releaseDate";

import { onMounted, ref, computed, inject } from "vue";
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
    categories.value = getCurrentCategories(currentGrouping.value, [...sortedGames.value]);
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

const currentGrouping = ref(localStorage.getItem("grouping") ? localStorage.getItem("grouping") : getDefaultGrouping());

function setGrouping(grouping) {
    currentGrouping.value = grouping;
    categories.value = getCurrentCategories(currentGrouping.value, [...sortedGames.value]);
    localStorage.setItem("grouping", grouping);
}

const sortedGames = computed(() => {
    const gamesCopy = [...games.value];

    return gamesCopy.sort((a, b) => {
        let selectedReleaseDateA = a.release_dates ? getSelectedReleaseDate(a).date : undefined;
        let selectedReleaseDateB = b.release_dates ? getSelectedReleaseDate(b).date : undefined;

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

const categories = ref([]);
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