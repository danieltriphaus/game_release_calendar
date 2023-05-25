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
import GameList from "../components/GameList";
import { inject, ref, provide } from "vue";

const user = inject("user");
const isAuthenticated = inject("isAuthenticated");
const gameListId = ref("default");
provide("gameListId", gameListId);

const gameListLoading = ref(false);
</script>
