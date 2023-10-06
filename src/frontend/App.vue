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

<script setup>
//ToDo: Move Footer and Authentication into separate components

import { computed, ref, onMounted, provide } from "vue";
import { useAuthentication } from "./composables/authentication";

const authenticationFailed = ref(false);
const isAuthenticated = ref(false);
const hasAcceptedPrivacyNotice = ref(false);
const user = ref({ id: "" });

provide("userId", computed(() => user.value.id));
provide("user", computed(() => user.value));
provide("isAuthenticated", computed(() => isAuthenticated.value));


const signInUrl = computed(() => {
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
});

onMounted(async () => {
    const auth = await useAuthentication();
    isAuthenticated.value = auth.isAuthenticated.value;
    authenticationFailed.value = auth.authenticationFailed.value;
    user.value = auth.user.value;
});
</script>