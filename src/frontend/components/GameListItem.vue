<template>
    <div
        :id="'game-' + props.game.id"
        class="col game"
        data-testid="game"
        data-cy="game"
    >
        <game-card
            :game="game"
            :selected-platform="selectedPlatform"
        >
            <div
                class="platforms"
                :data-cy="'platforms-' + props.game.id"
            >
                <platform-icon
                    v-for="(platform) in platforms"
                    :key="platform.id"
                    :platform="platform.abbreviation"
                    :selected="platform.isSelected"
                    :title="platform.title"
                    @click="onSelectPlatform(platform.id)"
                />
            </div>
        </game-card>
        <div class="game-actions">
            <a
                :href="game.url"
                target="_blank"
                class="game-details btn btn-igdb"
            ><i class="bi bi-info-square" /></a><br>
            <button
                type="button"
                class="btn btn-outline-danger"
                data-cy="delete-game"
                @click="emit('delete-game', props.game.id)"
            >
                <i class="bi bi-trash-fill" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, inject, computed } from "vue";
import GameCard from "./GameCard.vue";
import PlatformIcon from "./PlatformIcon.vue";
import { platformHelper } from "../library/platform.js";
import { apiClient } from "../library/apiClient";

const emit = defineEmits(["delete-game", "platform-selected"]);

const user = inject("user");
const { gameListId } = inject("gameListId");

const props = defineProps({
    game: {
        type: Object,
        default: () => {
            return {};
        },
    },
});

const platforms = ref([]);

const selectedPlatform = computed(() => platforms.value ? platforms.value.find((platform) => platform.isSelected) : undefined);

function onSelectPlatform(platformId) {
    const selectedPlatform = platforms.value.find((platform) => platform.id === platformId);

    if (selectedPlatform.isSelected === true) {
        selectedPlatform.isSelected = false;
        apiClient.user(user.value.id).games.post([{ id: props.game.id }], gameListId.value);
    } else {
        platforms.value.forEach((platform) => platform.isSelected = false);
        selectedPlatform.isSelected = true;
        apiClient.user(user.value.id).games.post([{ id: props.game.id, platform: platformId }], gameListId.value);
    }

    emit("platform-selected", props.game.id, selectedPlatform.isSelected ? selectedPlatform.id : undefined);
}

onMounted(() => {
    if (props.game.release_dates) {
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
    .game-actions {
        text-align: right;
        padding: 5px;
        margin-right: 0;
    }

    .game-actions .btn {
        font-size: 1.3rem;
    }

    .game-details {
        margin-bottom: 10px;
    }

    .game {
        border-bottom: 1px solid #6A9CCD;
    }

    .game-info h6 {
        font-size: 0.8rem;
    }

    .platforms {
        text-align: right;
        margin-right: 0;
        margin-left: auto;
        width: 120px;
        padding: 5px;
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