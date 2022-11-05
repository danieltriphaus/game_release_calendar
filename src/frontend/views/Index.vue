<template>
    <template v-if="isAuthenticated">
        <b-overlay :show="gameListLoading">
            <game-list
                :user-id="user.id"
                @loading="gameListLoading = true"
                @loading-complete="gameListLoading = false"
            />
        </b-overlay>
    </template>
</template>

<script setup>
import GameList from "../components/GameList";
import { inject, ref } from "vue";

const user = inject("user");
const isAuthenticated = inject("isAuthenticated");

const gameListLoading = ref(false);
</script>
