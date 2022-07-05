<template>
    <div>
        <div class="row mt-4">
            <div class="col">
                <input type="search" v-debounce:500ms="searchGames" v-model="search.query" data-cy="search-games" name="search-games" class="form-control" placeholder="Search Games">
                <b-spinner v-if="isSearchInProgress" class="inside-input-spinner" variant="primary" data-cy="game-search-spinner"></b-spinner>
            </div>
        </div>

        <div class="results mt-2" v-for="result in search.results" :key="result.id">
            <search-result :result="result" @game-added="onGameAdded"/>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";

import { reactive, defineEmits, ref } from "vue";
import { getDirective } from "vue-debounce";

import SearchResult from "./SearchResult";

const emit = defineEmits(["game-added"]);

const vDebounce = getDirective(3);

const search = reactive({ 
    query: "",
    results: []
});

const isSearchInProgress = ref(false);

async function searchGames() {
    isSearchInProgress.value = true;
    const response = await axios.get("/api/game/search", { params: { q: search.query }});
    search.results = response.data;
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
        margin-right: 10px;
    }
</style>
