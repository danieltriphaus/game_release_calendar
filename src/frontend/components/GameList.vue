<template>
    <game-search @game-added="onGameAdded" />
    <add-temporary-game @game-added="onGameAdded" />
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
            />
        </div>
    </base-collapsable>
</template>

<script setup>
import GameSearch from "./GameSearch.vue";
import GameListItem from "./GameListItem.vue";
import AddTemporaryGame from "./AddTemporaryGame.vue";
import BaseCollapsable from "./BaseCollapsable.vue";

import { onMounted, ref, computed, inject, reactive } from "vue";
import axios from "axios";

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

async function populateGameList() {
    emits("loading");
    const response = await axios.get("/api/user/" + props.userId + "/games");
    if (response) {
        games.value = response.data;
    }
    emits("loading-complete");
}

onMounted(async () => {
    await populateGameList();
});

function onGameAdded(game) {
    games.value.push(game);
}

async function deleteGame(id) {
    await axios.delete("/api/user/" + user.value.id + "/games", { data: [id] });
    populateGameList();
}

//ToDo: Sorting should respect selected platform
const sortedGames = computed(() => {
    const gamesCopy = [...games.value];

    return gamesCopy.sort((a, b) => {
        if (a.first_release_date < b.first_release_date || !b.first_release_date) {
            return -1;
        }
        if (a.first_release_date > b.first_release_date || !a.first_release_date) {
            return 1;
        }
        if (a.first_release_date === b.first_release_date) {
            return 0;
        }
    });
});

const releasedGames = computed(() => {
    return sortedGames.value.filter((game) => {
        return new Date(game.first_release_date * 1000) <= new Date();
    });
});

const unreleasedGames = computed(() => {
    return sortedGames.value.filter((game) => {
        return new Date(game.first_release_date * 1000) > new Date() || !game.first_release_date;
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