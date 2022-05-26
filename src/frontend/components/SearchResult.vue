<template>
    <div class="row">
        <div class="col result mt-2" :data-cy="'result-' + result.id" @click="addGame(result.id)">
            <img v-if="hasCover" :src="coverUrl" class="game-cover">
            <div class="game-info">
                <h5 data-cy="game-title">{{ result.name }}</h5>
                <h6>{{ developerName }}</h6>
                <h6 data-cy="release-date">{{ releaseDate }}</h6>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { computed, inject } from "vue";

const userId = inject("userId");

const props = defineProps(["result"]);
const emit = defineEmits(["game-added"]);

const hasCover = computed(() => {
    return props.result.cover && props.result.cover.url;
});

const coverUrl = computed(() => {
    return props.result.cover.url.replace('thumb', 'cover_small')
});

const developerName = computed(() => {
    return props.result.involved_companies.find((involved_company) => involved_company.developer === true).company.name
});

const releaseDate = computed(() => {
    if (!props.result.first_release_date) {
        return "TBA";
    } else {
        const releaseDateObject = new Date(props.result.first_release_date * 1000);
        return releaseDateObject.toLocaleDateString(navigator.language, { year: "numeric", month: "2-digit", day: "2-digit" })
    }
});

function addGame() {    
    axios.post("/api/user/" + userId.value + "/games", [props.result.id]);
    emit("game-added", props.result.id);
}
</script>

<style scoped>
    .result {
        display: flex;
        cursor: pointer;
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