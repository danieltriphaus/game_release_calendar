<template>
    <div class="row">
        <div class="col result mt-2" :data-testid="'result-' + result.id" @click="addGame(result.id)">
            <img v-if="hasCover" :src="coverUrl" class="game-cover">
            <div class="game-info">
                <h5>{{ result.name }}</h5>
                <h6>{{ developerName }}</h6>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { computed } from "vue";

const props = defineProps(["result"]);

const hasCover = computed(() => {
    return props.result.cover && props.result.cover.url;
});

const coverUrl = computed(() => {
    return props.result.cover.url.replace('thumb', 'cover_small')
});

const developerName = computed(() => {
    return props.result.involved_companies.find((involved_company) => involved_company.developer === true).company.name
});

async function addGame() {    
    await axios.post("/api/user/y1xx/games", [props.result.id]);
}
</script>

<style scoped>
    .result {
        display: flex;
        cursor: pointer;
        padding: 2px;
    }

    .result:hover {
        background-color: rgb(211, 209, 209);
    }

    .game-cover {   
        height: 100px;
    }

    .game-info {
        margin-top: 10px;
        padding-left: 10px;
    }
</style>