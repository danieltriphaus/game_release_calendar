<template>
    <div class="container-lg">
        <div
            v-show="!isAuthenticated"
            class="row mt-4"
        >
            <div v-if="authenticationFailed">
                <SignInButton />
            </div>
        </div>
        <router-view v-if="isAuthenticated" />
    </div>
    <AppFooter />
</template>

<script setup>
import { computed, ref, onMounted, provide } from "vue";
import { useAuthentication } from "./composables/authentication";
import AppFooter from "./components/AppFooter.vue";
import SignInButton from "./components/SignInButton.vue";

const authenticationFailed = ref(false);
const isAuthenticated = ref(false);
const user = ref({ id: "" });

provide("userId", computed(() => user.value.id));
provide("user", computed(() => user.value));
provide("isAuthenticated", computed(() => isAuthenticated.value));

onMounted(async () => {
    const auth = await useAuthentication();
    isAuthenticated.value = auth.isAuthenticated.value;
    authenticationFailed.value = auth.authenticationFailed.value;
    user.value = auth.user.value;
});
</script>

<style>
    .container-lg {
        margin-bottom: 56px;
    }
</style>