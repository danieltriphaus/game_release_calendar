<template>
    <div>
        <div class="row mt-4">
            <div class="col">
                <input type="search" v-debounce:500ms="searchGames" v-model="search.query" id="search-games" name="search-games" class="form-control" placeholder="Suche Game">
            </div>
        </div>

        <div class="results mt-2" v-for="result in search.results" :key="result.id">
            <search-result :result="result" />
        </div>
    </div>
</template>

<script setup>
import axios from "axios";

import { reactive } from "vue";
import { getDirective } from "vue-debounce";

import SearchResult from "./SearchResult";

const vDebounce = getDirective(3);

const search = reactive({ 
    query: "",
    results: []
});

async function searchGames() {
    const response = await axios.get("/api/game/search", { params: { q: search.query }});
    search.results = response.data;
}
</script>

