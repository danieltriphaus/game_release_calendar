<template>
    <div class="row" v-for="game in sortedGames" :key="game.id">
        <div :id="'game-' + game.id" class="col game mt-2" data-testid="game">
            <img v-if="game.cover" :src="game.cover.url.replace('thumb', 'cover_small')" class="game-cover" :data-testid="'game-' + game.id + '-cover'">
            <div class="game-info">
                <h5>{{ game.name }}</h5>
                <h6>{{ game.involved_companies.find((company) => company.developer).company.name }}</h6>
                <h6 data-testid="release-date">{{ (new Date(game.first_release_date * 1000)).toLocaleDateString("de-DE", { year: "numeric", month: "2-digit", day: "2-digit" }) }}</h6>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import axios from "axios";

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

onMounted(async () => {
    const response = await axios.get("/api/user/" + props.userId + "/games").catch(() => { 
        console.log("error");
        //ToDo: implement UI Message no Games added
    });
    if (response) {
        games.value = response.data;
    }
});

//ToDo: move sorting logic to api layer
const sortedGames = computed(() => {
    const gamesCopy = [ ...games.value ];
    
    return gamesCopy.sort((a, b) => {
        if (a.first_release_date < b.first_release_date) {
            return -1;
        }
        if (a.first_release_date > b.first_release_date) {
            return 1;
        }
        if (a.first_release_date === b.first_release_date) {
            return 0;
        }
    });
});
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
</style>