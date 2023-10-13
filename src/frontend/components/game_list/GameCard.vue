<template>
    <img
        v-if="hasCover"
        loading="lazy"
        :src="coverUrl"
        class="game-cover"
        :data-testid="'game-' + props.game.id + '-cover'"
    >
    <div class="game-info">
        <h5 data-cy="game-title">
            {{ props.game.name }}
        </h5>
        <h6>{{ developer }}</h6>
        <h6
            data-testid="release-date"
            data-cy="release-date"
            class="release-date"
        >
            {{ releaseDate }}
        </h6>
    </div>
    <slot />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    game: {
        type: Object,
        default: () => {
            return {};
        },
    },
    showPlatforms: {
        type: Boolean,
        default: true,
    },
    selectedPlatform: {
        type: Object,
        default: undefined,
    },
});

defineEmits(["platform-selected"]);

const hasCover = computed(() => {
    return props.game.cover && props.game.cover.url;
});

const coverUrl = computed(() => {
    return props.game.cover.url.replace("thumb", "cover_small");
});

const developer = computed(() => {
    return props.game.involved_companies ? props.game.involved_companies.find((company) => company.developer).company.name : "";
});

const releaseDate = computed(() => {
    if (!props.game.release_dates) {
        return "TBD";
    } else if (selectedReleaseDate.value.category === 0) {
        const releaseDateObject = new Date(selectedReleaseDate.value.date * 1000);
        return releaseDateObject.toLocaleDateString(navigator.language, { year: "numeric", month: "2-digit", day: "2-digit" });
    } else {
        return selectedReleaseDate.value.human;
    }
});


const selectedReleaseDate = computed(() => {
    const selectedPlatform = props.selectedPlatform;
    if (selectedPlatform) {
        return props.game.release_dates.find((releaseDate) => releaseDate.platform.id === selectedPlatform.id);
    } else {
        return props.game.release_dates.find((releaseDate) => releaseDate.date === props.game.first_release_date);
    }
});
</script>

<style scoped>
    img {
        max-height: 130px;
    }

    .game-info {
        padding: 5px 0 5px 5px;
    }

    .game-info h5 {
        font-size: 1rem;
    }

    .game-info h6 {
        font-size: 0.8rem;
    }
</style>