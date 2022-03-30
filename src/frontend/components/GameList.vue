<template>
    <div>
        <div class="row" v-for="game in sortedGames" :key="game.id">
            <div class="col game mt-2">
                <img v-if="game.cover" :src="game.cover.url.replace('thumb', 'cover_small')" class="game-cover" :data-testid="'game-' + game.id + '-cover'">
                <div class="game-info">
                    <h5>{{ game.name }}</h5>
                    <h6>{{ game.involved_companies.find((company) => company.developer).company.name }}</h6>
                    <h6 data-testid="release-date">{{ (new Date(game.first_release_date * 1000)).toLocaleDateString() }}</h6>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import axios from "axios";

defineProps({
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
    const response = await axios.get("/api/user/" + process.env.VUE_APP_DEFAULT_USER + "/games");
    games.value = response.data;
});

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
        padding: 2px;
    }

    .game-cover {   
        height: 100px;
    }

    .game-info {
        margin-top: 10px;
        padding-left: 10px;
    }
</style>