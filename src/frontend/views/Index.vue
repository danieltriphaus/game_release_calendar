<template>
    <div class="row">
        <template v-if="isAuthenticated">
            <router-link to="/calendar">Kalendar generieren</router-link>
            <game-list :userId="user.id"/>
        </template>
    </div>
</template>

<script setup>
import GameList from "../components/GameList";
import { inject } from "vue";

const user = inject("user");
const isAuthenticated = inject("isAuthenticated");
</script>
