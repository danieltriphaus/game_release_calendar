<template>
    <img
        v-if="hasCover"
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
    <!-- ToDo: Move Platform Logic to Slot in GameListItem-->
    <div
        v-if="showPlatforms"
        class="platforms"
        :data-cy="'platforms-' + props.game.id"
    >
        <PlatformIcon
            v-for="(platform) in platforms"
            :key="platform.id"
            :platform="platform.abbreviation"
            :selected="platform.isSelected"
            :title="platform.title"
            @click="onSelectPlatform(platform.id)"
        />
    </div>
</template>

<script setup>
import { computed, ref, onMounted, inject } from "vue";
import PlatformIcon from "./PlatformIcon.vue";
import { platformHelper } from "../library/platform.js";
import { apiClient } from "../library/apiClient";

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
});

const emit = defineEmits(["platform-selected"]);

const user = inject("user");

const platforms = ref([]);

function onSelectPlatform(platformId) {
    const selectedPlatform = platforms.value.find((platform) => platform.id === platformId);

    if (selectedPlatform.isSelected === true) {
        selectedPlatform.isSelected = false;
        apiClient.user(user.value.id).games.post([{ id: props.game.id }]);
    } else {
        platforms.value.forEach((platform) => platform.isSelected = false);
        selectedPlatform.isSelected = true;
        apiClient.user(user.value.id).games.post([{ id: props.game.id, platform: platformId }]);
    }

    emit("platform-selected", props.game.id, selectedPlatform.isSelected ? selectedPlatform.id : undefined);
}

const hasCover = computed(() => {
    return props.game.cover && props.game.cover.url;
});

const coverUrl = computed(() => {
    return props.game.cover.url.replace("thumb", "cover_small");
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
    const selectedPlatform = platforms.value ? platforms.value.find((platform) => platform.isSelected) : undefined;
    if (selectedPlatform) {
        return props.game.release_dates.find((releaseDate) => releaseDate.platform.id === selectedPlatform.id);
    } else {
        return props.game.release_dates.find((releaseDate) => releaseDate.date === props.game.first_release_date);
    }
});

const developer = computed(() => {
    return props.game.involved_companies ? props.game.involved_companies.find((company) => company.developer).company.name : "";
});

onMounted(() => {
    if (props.showPlatforms && props.game.release_dates) {
        platforms.value = props.game.release_dates.reduce((platformData, releaseDate) => {
            if (releaseDate.platform) {
                const platform = platformHelper(releaseDate.platform);
                if (platform.isConfigured()) {
                    platformData.push({
                        id: releaseDate.platform.id,
                        isSelected: platform.isSelected(props.game.selectedPlatform),
                        title: releaseDate.platform.name,
                        abbreviation: platform.getConfiguredAbbreviation(),
                    });
                }
                return platformData;
            }
        }, []);
    }
});
</script>

<style scoped>
    img {
        height: 100px;
    }

    .game-info {

        padding-left: 10px;
    }

    .game-info h5 {
        font-size: 1rem;
    }

    .game-info h6 {
        font-size: 0.8rem;
    }

    .platforms {
        text-align: right;
        margin-right: 0;
        margin-left: auto;
        width: 120px;
    }

    .platform {
        display: inline-block;
        padding: 2px 4px;
        margin-right: 1px;
        margin-top: 1px;
        border-radius: 4px;
        color: #fff;
    }

    .platform.ps5 {
        background-color:#30405080;
    }

    .platform.ps5.selected {
        background-color: #304050;
    }

    .platform.xsx {
        background-color: #107c1093;
    }

    .platform.xsx.selected {
        background-color: #107C10;
    }

    .platform.ns {
        background-color: #e6001370;
    }

    .platform.ns.selected {
        background-color: #e60012;
    }
</style>