<template>
    <input type="password" name="auth_key" v-if="nodeEnv === 'development'" @keyup.enter="sendAuthKey" v-model="authKey"/>
</template>

<script setup>
    import axios from "axios";
    import { onMounted, computed, ref } from "vue";

    const authKey = ref();

    const emit = defineEmits(["authenticated", "authentication-failed"]);

    const nodeEnv = computed(() => process.env.NODE_ENV);

    onMounted(async () => {
        const response = await axios.get("/api/access").catch((error) => {
            if (!error.response || error.response.status !== 401) {
                throw error;
            }
            if (error.response && error.response.status === 401) {
                emit("authentication-failed");
            }
        });
        if (response && response.status === 200) {
            emit("authenticated", response.data);
        }
    });

    async function sendAuthKey() {
        const response = await axios.get("/api/access", {params: { auth_key: authKey.value }}).catch((error) => {
            if (!error.response || error.response.status !== 401) {
                throw error;
            }
            if (error.response && error.response.status === 401) {
                emit("authentication-failed");
            }
        });
        if (response && response.status === 200) {
            emit("authenticated", response.data);
        }
    }
</script>