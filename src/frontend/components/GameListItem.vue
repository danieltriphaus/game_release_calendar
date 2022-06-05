<template>
    <div :id="'game-' + props.game.id" class="col game mt-2" data-testid="game" data-cy="game">
        <game-card :game="game" />
        <div class="game-actions">
            <a :href="game.url" target="_blank" class="game-details btn btn-igdb">Details</a><br>
            <button type="button" @click="emit('delete-game', props.game.id)" class="btn btn-outline-danger" data-cy="delete-game">Löschen</button>
        </div>
    </div>
</template>

<script setup>
import GameCard from "./GameCard.vue";

const emit = defineEmits(["delete-game"]);

const props = defineProps({
    game: {
        type: Object,
        default: () => { return {} }
    }
});
</script>

<style scoped>
    .game-actions {
        text-align: right;
        margin-top: 10px;
        padding-left: 10px;
    }
</style>