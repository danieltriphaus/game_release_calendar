<template>
    <div class="row">
        <div
            class="col result mt-2"
            :data-cy="'result-' + result.id"
            @click="addGame(result.id)"
        >
            <game-card
                :game="result"
                :show-platforms="false"
            />
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { inject } from "vue";
import GameCard from "./GameCard.vue";

const userId = inject("userId");

const props = defineProps({ result: { type: Object, default: () => {} } });
const emit = defineEmits(["game-added"]);

function addGame() {
    axios.post("/api/user/" + userId.value + "/games", [props.result.id]);
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