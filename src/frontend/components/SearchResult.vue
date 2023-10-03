<template>
    <div class="row">
        <div
            class="col result mt-2"
            :data-cy="'result-' + result.id"
            @click="addGame()"
        >
            <game-card
                :game="result"
                :show-platforms="false"
            />
        </div>
    </div>
</template>

<script setup>
import { inject } from "vue";
import GameCard from "./GameCard.vue";
import { apiClient } from "../library/apiClient";

const userId = inject("userId");
const { gameListId } = inject("gameListId");

const props = defineProps({ result: { type: Object, default: () => {} } });
const emit = defineEmits(["game-added"]);

async function addGame() {
    await apiClient.user(userId.value).games.post([{ id: props.result.id }], gameListId.value);
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
</style>