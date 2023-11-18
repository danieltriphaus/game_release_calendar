<template>
    <div>
        <div class="row mt-2">
            <div class="col">
                <b-input-group>
                    <input
                        v-model="search.query"
                        v-debounce:500ms="searchGames"
                        type="search"
                        data-cy="search-games"
                        name="search-games"
                        class="form-control"
                        placeholder="Search Games"
                    >
                    <template #append>
                        <user-menu />
                    </template>
                </b-input-group>
                <b-spinner
                    v-if="isSearchInProgress"
                    variant="primary"
                    class="inside-input-spinner"
                    data-cy="game-search-spinner"
                />
            </div>
        </div>
        <div style="max-height: 712px; overflow-y: scroll; overflow-x: hidden">
            <div
                v-for="result in search.results"
                :key="result.id"
                class="results mt-2"
            >
                <search-result
                    :result="result"
                    @game-added="onGameAdded"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { apiClient } from "../../library/apiClient";

import { reactive, defineEmits, ref } from "vue";
import { getDirective } from "vue-debounce";
import UserMenu from "../UserMenu.vue";
import SearchResult from "./SearchResult.vue";

const emit = defineEmits(["game-added"]);

const vDebounce = getDirective(3);

const search = reactive({
    query: "",
    results: [],
});

const isSearchInProgress = ref(false);

async function searchGames() {
    isSearchInProgress.value = true;
    search.results = await apiClient.game.search.get(search.query);
    isSearchInProgress.value = false;
}

function onGameAdded(id) {
    search.query = "";
    const addedGame = search.results.find((result) => result.id === id);
    search.results = [];
    emit("game-added", addedGame);
}
</script>

<style scoped>
    .inside-input-spinner {
        float: right;
        margin-top: -34px;
        width: 1.7rem;
        height: 1.7rem;
        margin-right: 50px;
        position: relative;
        z-index: 10;
    }
</style>
