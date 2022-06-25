<template>
    <game-search @game-added="onGameAdded" />
    <add-temporary-game @game-added="onGameAdded" />
    <div class="list-category" v-b-toggle.released-games>
        <h5 class="list-heading mt-4">Released Games</h5>
        <i class="list-icon mt-4" :class="'bi-' + accordionTabIcon('released-games')"></i>
    </div>
    <b-collapse 
        id="released-games"
        :visible="categoryAccordion.isVisible['released-games']"
        @hide="onCollapseStateChanged('released-games', false)"
        @show="onCollapseStateChanged('released-games', true)"
    >
        <div class="row" data-cy="released-games" v-for="game in releasedGames" :key="game.id">
            <game-list-item :game="game" @delete-game="deleteGame" />
        </div>
    </b-collapse>
    <div class="list-category" v-b-toggle.unreleased-games>
        <h5 class="list-heading mt-4">Unreleased Games</h5>
        <i class="list-icon mt-4" :class="'bi-' + accordionTabIcon('unreleased-games')"></i>
    </div>
    <b-collapse
        id="unreleased-games"
        :visible="categoryAccordion.isVisible['unreleased-games']" 
        @hide="onCollapseStateChanged('unreleased-games', false)"
        @show="onCollapseStateChanged('unreleased-games', true)"
    >
        <div class="row" data-cy="unreleased-games" v-for="game in unreleasedGames" :key="game.id">
            <game-list-item :game="game" @delete-game="deleteGame" />
        </div>
    </b-collapse>
</template>

<script setup>
import GameSearch from "./GameSearch.vue";
import GameListItem from "./GameListItem.vue";
import AddTemporaryGame from "./AddTemporaryGame.vue";

import { onMounted, onBeforeMount, ref, computed, inject, reactive } from "vue";
import axios from "axios";

const user = inject("user");

const emits = defineEmits(["loading", "loading-complete"]);

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

const categoryAccordion = reactive({
    isVisible: {
        "released-games": false,
        "unreleased-games": false,
    },
    icons: {
        open: "caret-up-fill",
        closed: "caret-down-fill"
    }
});

function onCollapseStateChanged(id, state) {
    categoryAccordion.isVisible[id] = state;
    localStorage.setItem("categoryExpandCollapse", JSON.stringify(categoryAccordion.isVisible));
}

const accordionTabIcon = computed(() => {
    return (category) => {
        if (categoryAccordion.isVisible[category] === true) {
            return categoryAccordion.icons.open;
        } else {
            return categoryAccordion.icons.closed;
        }
    }
})

async function populateGameList() {
    emits("loading");
    const response = await axios.get("/api/user/" + props.userId + "/games").catch((error) => { 
        console.log(error.response);
        //ToDo: implement UI Message no Games added
    });
    if (response) {
        games.value = response.data;
    }
    emits("loading-complete");
}

onMounted(async () => {
    await populateGameList();
});

onBeforeMount(() => {
    if (localStorage.getItem("categoryExpandCollapse")) {
        categoryAccordion.isVisible = JSON.parse(localStorage.getItem("categoryExpandCollapse"));
    }
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

    .list-category {
        display: flex;
    }

    .list-icon {
        font-size: 1.25rem;
        color: var(--bs-primary);
        margin-right: 0;
        margin-left: auto;
    }

    .border {
        border-bottom: 1px;
        border-bottom-color: black;
    }
</style>