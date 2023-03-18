<template>
    <input
        v-if="nodeEnv === 'development'"
        v-model="authKey"
        type="password"
        name="auth_key"
        @keyup.enter="sendAuthKey"
    >
</template>

<script setup>
//ts-check
import { apiClient } from "../library/apiClient";
import { onMounted, computed, ref } from "vue";

const authKey = ref();

const emit = defineEmits(["authenticated", "authentication-failed"]);

const nodeEnv = computed(() => import.meta.env.MODE);

onMounted(async () => {
    await doAuthentication();
});

async function sendAuthKey() {
    await doAuthentication(authKey.value);
}

/**
 * @param {string} [authKey]
 */
async function doAuthentication(authKey) {
    const user = await apiClient.access.get(authKey);
    if (user) {
        emit("authenticated", user);
    } else {
        emit("authentication-failed");
    }
}
</script>