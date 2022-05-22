<template>
    <div :id="'game-' + props.game.id" class="col game mt-2" data-testid="game">
        <img v-if="props.game.cover" :src="props.game.cover.url.replace('thumb', 'cover_small')" class="game-cover" :data-testid="'game-' + props.game.id + '-cover'">
        <div class="game-info">
            <h5>{{ props.game.name }}</h5>
            <h6>{{ developer }}</h6>
            <h6 data-testid="release-date">{{ releaseDate }}</h6>
        </div>
        <div class="game-actions">
            <button type="button" @click="emit('delete-game', props.game.id)" class="btn btn-outline-danger">Löschen</button>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const emit = defineEmits(["delete-game"]);

const props = defineProps({
    game: {
        type: Object,
        default: () => { return {} }
    }
});

const releaseDate = computed(() => {
    if (!props.game.first_release_date) {
        return "TBA";
    } else {
        const releaseDateObject = new Date(props.game.first_release_date * 1000);
        return releaseDateObject.toLocaleDateString(navigator.language, { year: "numeric", month: "2-digit", day: "2-digit" })
    }
});

const developer = computed(() => {
    return props.game.involved_companies.find((company) => company.developer).company.name
});
</script>

<style scoped>
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
</style>