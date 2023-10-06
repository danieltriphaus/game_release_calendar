<template>
    <template v-if="isAuthenticated">
        <b-overlay :show="gameListLoading">
            <game-list
                :user-id="user.id"
                :game-list-id="gameListId"
                @loading="gameListLoading = true"
                @loading-complete="gameListLoading = false"
                @change-list="gameListId = $event"
            />
        </b-overlay>
    </template>
</template>

<script setup>
import GameList from "../components/GameList.vue";
import { inject, ref, provide } from "vue";

//ToDo: Move list changing into GameList component

const user = inject("user");
const isAuthenticated = inject("isAuthenticated");
const gameListId = ref("default");
function changeGameListId(newGameListId) {
    gameListId.value = newGameListId;
}

provide("gameListId", { gameListId, changeGameListId });

const gameListLoading = ref(false);
</script>
