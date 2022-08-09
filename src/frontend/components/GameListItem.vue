<template>
    <div
        :id="'game-' + props.game.id"
        class="col game"
        data-testid="game"
        data-cy="game"
    >
        <game-card :game="game" />
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
import GameCard from "./GameCard.vue";

const emit = defineEmits(["delete-game"]);

const props = defineProps({
    game: {
        type: Object,
        default: () => {
            return {};
        },
    },
});
</script>

<style scoped>
    .game-actions {
        text-align: right;
        padding-left: 10px;
        margin-right: 0;
        margin-left: auto;
    }

    .game-actions .btn {
        font-size: 1.3rem;
    }

    .game-details {
        margin-bottom: 10px;
    }

    .game {
        border-bottom: 1px solid #6A9CCD;
        padding-top: 10px;
        padding-bottom: 10px;
    }
</style>