<template>
    <img v-if="hasCover" :src="coverUrl" class="game-cover" :data-testid="'game-' + props.game.id + '-cover'">
    <div class="game-info">
        <h5 data-cy="game-title">{{ props.game.name }}</h5>
        <h6>{{ developer }}</h6>
        <h6 data-testid="release-date" data-cy="release-date" class="release-date">{{ releaseDate }}</h6>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    game: {
        type: Object,
        default: () => { return {} }
    }
});

const hasCover = computed(() => {
    return props.game.cover && props.game.cover.url;
});

const coverUrl = computed(() => {
    return props.game.cover.url.replace('thumb', 'cover_small')
});

const releaseDate = computed(() => {
    if (!props.game.release_dates) {
        return "TBD";
    } else if (props.game.release_dates[0].category === 0) {
        const releaseDateObject = new Date(props.game.release_dates[0].date * 1000);
        return releaseDateObject.toLocaleDateString(navigator.language, { year: "numeric", month: "2-digit", day: "2-digit" })
    } else {
        return props.game.release_dates[0].human;
    }
});

const developer = computed(() => {
    return props.game.involved_companies ? props.game.involved_companies.find((company) => company.developer).company.name : "";
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
</style>