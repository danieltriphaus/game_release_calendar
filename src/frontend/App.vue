<template>
    <div class="container">
        <div
            v-show="!isAuthenticated"
            class="row mt-4"
        >
            <div v-if="authenticationFailed">
                <input
                    id="privacy"
                    v-model="hasAcceptedPrivacyNotice"
                    type="checkbox"
                > <label for="privacy">I Have read and accept the <a href="/landingpage/privacy_notice/">Privacy Notice</a></label><br>
                <b-button
                    :href="signInUrl"
                    variant="primary"
                    :disabled="!hasAcceptedPrivacyNotice"
                >
                    Sign in with Google
                </b-button>
            </div>
        </div>
        <router-view v-if="isAuthenticated" />
    </div>
    <nav class="navbar navbar-expand-lg text-bg-light position-fixed bottom-0 w-100 footer">
        <div class="container-fluid">
            <div class="navbar-nav flex-row">
                <a
                    class="nav-link p-2"
                    href="/landingpage/imprint/"
                >Imprint</a>
                <a
                    class="nav-link p-2"
                    href="/landingpage/privacy_notice/"
                >Privacy</a>
            </div>
        </div>
    </nav>
</template>

<script>
import { computed } from "vue";
import { useAuthentication } from "./composables/authentication";

//ToDo: SetUp Snapshot Testing
//ToDo: Convert into Composition API
//ToDo: Move Footer and Authentication into separate components

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
            hasAcceptedPrivacyNotice: false,
            gsiAppId: import.meta.env.VITE_GOOGLE_SIGN_IN_APP_ID,
            user: {
                id: "",
            },
        };
    },
    computed: {
        signInUrl() {
            let url = "";
            if (import.meta.env.MODE === "production") {
                url = "/login/google";
            } else {
                url = "http://localhost:3000/login/google";
            }
            const redirectSegment = window.location.search ? new URLSearchParams(window.location.search).get("redirect") : undefined;

            if (redirectSegment && redirectSegment !== "/") {
                return url + "?redirect=" + redirectSegment;
            } else {
                return url;
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