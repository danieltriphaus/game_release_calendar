<template>
    <game-search @game-added="onGameAdded" />
    <add-temporary-game @game-added="onGameAdded" />
    <h5>Released Games</h5>
    <div class="row" data-cy="released-games" v-for="game in releasedGames" :key="game.id">
        <game-card :game="game" @delete-game="deleteGame" />
    </div>
    <div class="border mt-4"></div>
    <h5>Unreleased Games</h5>
    <div class="row" data-cy="unreleased-games" v-for="game in unreleasedGames" :key="game.id">
        <game-card :game="game" @delete-game="deleteGame" />
    </div>
</template>

<script setup>
import GameSearch from "./GameSearch.vue";
import GameCard from "./GameCard.vue";
import AddTemporaryGame from "./AddTemporaryGame.vue";

import { onMounted, ref, computed, inject } from "vue";
import axios from "axios";

const user = inject("user");

const props = defineProps({
    userId: {
        type: String,
        default: ""
    },
    gameListId: {
        type: String,
        default: "default"
    }
});

const games = ref([]);

async function populateGameList() {
    const response = await axios.get("/api/user/" + props.userId + "/games").catch((error) => { 
        console.log(error.response);
        //ToDo: implement UI Message no Games added
    });
    if (response) {
        games.value = response.data;
    }
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

//ToDo: move sorting logic to api layer
const sortedGames = computed(() => {
    const gamesCopy = [ ...games.value ];
    
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
    const games = sortedGames.value.filter((game) => {
        return new Date(game.first_release_date * 1000) <= new Date()
    });
    return games;
});

const unreleasedGames = computed(() => {
    const games = sortedGames.value.filter((game) => {
        return new Date(game.first_release_date * 1000) > new Date() || !game.first_release_date
    });
    return games;
})
</script>

<style scoped>
    .game {
        display: flex;
    }

    .game-cover {   
        height: 100px;
    }

    .game-info {
        margin-top: 10px;
        padding-left: 10px;
    }

    .game-actions {
        text-align: right;
        margin-top: 10px;
        padding-left: 10px;
    }

    .border {
        border-bottom: 1px;
        border-bottom-color: black;
    }
</style>