<template>
    <div>
        <game-search @game-added="onGameAdded" />

        <game-list-menu
            :games="games"
            @game-added="onGameAdded"
            @delete-game="populateGameList"
            @change-grouping="setGrouping"
            @refresh-games="refreshGames"
        />
    </div>
    <div>
        <template v-if="gameListId === 'archive'">
            <h2>
                Archive
            </h2>
            <b-button
                data-test="change-list-default"
                @click="changeGameListId('default')"
            >
                Back to List
            </b-button>
        </template>
        <template v-if="currentGrouping === 'no-grouping' || gameListId === 'archive'">
            <div
                v-for="game in gamesForList"
                :key="game.id"
                class="row"
            >
                <game-list-item
                    :game="game"
                    @delete-game="deleteGame"
                    @platform-selected="onPlatformSelected"
                />
            </div>
        </template>
        <template v-else-if="categories.length > 0">
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
import GameSearch from "../search/GameSearch.vue";
import GameListItem from "./GameListItem.vue";
import BaseCollapsable from "../BaseCollapsable.vue";
import GameListMenu from "../game_list_menu/GameListMenu.vue";
import { getDefaultGrouping, getCurrentCategories } from "../../library/groupings";
import { getSelectedReleaseDate } from "../../library/releaseDate";

import { onMounted, ref, computed, inject, watch } from "vue";
import { apiClient } from "../../library/apiClient";

const user = inject("user");

const { changeGameListId } = inject("gameListId");
const isSorted = ref(true);

const emits = defineEmits(["loading", "loading-complete", "show-archive", "show-default"]);

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

watch(() => props.gameListId, async () => {
    if (props.gameListId !== "default") {
        setGrouping("no-grouping");
        isSorted.value = false;
    }
    await populateGameList();
});

/**
 * @async
 * @function populateGameList
 */
async function populateGameList() {
    emits("loading");
    games.value = await apiClient.user(props.userId).games.get(props.gameListId);
    emits("loading-complete");
}

async function refreshGames() {
    games.value = [];
    await apiClient.user(props.userId).games.deleteGameListCache(props.gameListId);
    await populateGameList();
}

onMounted(async () => {
    await populateGameList();
});

async function onGameAdded() {
    await populateGameList();
}

async function deleteGame(id) {
    await apiClient.user(user.value.id).games.delete([{ id }], props.gameListId);
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
    localStorage.setItem("grouping", grouping);
}

const categories = computed(() => {
    return getCurrentCategories(currentGrouping.value, [...sortedGames.value]);
});

const gamesForList = computed(() => {
    return isSorted.value ? sortedGames.value : games.value;
});

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