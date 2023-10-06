<template>
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
</template>

<script setup>
import { ref, computed } from "vue";

const hasAcceptedPrivacyNotice = ref(false);

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
</script>