<template>
    <div class="container">
        <div
            v-show="!isAuthenticated"
            class="row mt-4"
        >
            <div v-if="authenticationFailed">
                <b-button
                    :href="signInUrl"
                    variant="primary"
                >
                    Sign in with Google
                </b-button>
            </div>
        </div>
        <router-view v-if="isAuthenticated" />
    </div>
</template>

<script>
import { computed } from "vue";
import { useAuthentication } from "./composables/authentication";

export default {
    provide() {
        return {
            userId: computed(() => this.user.id),
            user: computed(() => this.user),
            isAuthenticated: computed(() => this.isAuthenticated),
        };
    },
    data() {
        return {
            authenticationFailed: false,
            isAuthenticated: false,
            gsiAppId: import.meta.env.VITE_GOOGLE_SIGN_IN_APP_ID,
            user: {
                id: "",
            },
        };
    },
    computed: {
        signInUrl() {
            if (import.meta.env.MODE === "production") {
                return "/login/google";
            } else {
                return "http://localhost:3000/login/google";
            }
        },
    },
    async mounted() {
        const { isAuthenticated, authenticationFailed, user } = await useAuthentication();
        this.isAuthenticated = isAuthenticated;
        this.authenticationFailed = authenticationFailed;
        this.user = user;
    },
};
</script>