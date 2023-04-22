<template>
    <b-dropdown
        id="user-menu"
        variant="light"
        no-caret
        class="user-menu"
    >
        <template #button-content>
            <i class="bi-person-circle" />
        </template>
        <b-dropdown-item
            variant="danger"
            @click="signOut"
        >
            <i class="bi-door-open me-2" />Sign Out
        </b-dropdown-item>
    </b-dropdown>
</template>

<script setup>
import { apiClient } from "../library/apiClient";
import { useRouter } from "vue-router";

const router = useRouter();

async function signOut() {
    if (await apiClient.access.delete()) {
        await router.push("/");
        window.location.reload();
    }
}
</script>

<style>
#user-menu {
    box-shadow: none;
}
</style>