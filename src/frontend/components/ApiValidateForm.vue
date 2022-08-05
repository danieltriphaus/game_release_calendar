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
import axios from "axios";
import { onMounted, computed, ref } from "vue";

const authKey = ref();

const emit = defineEmits(["authenticated", "authentication-failed"]);
    
const nodeEnv = computed(() => import.meta.env.MODE);

onMounted(async () => {
    await doAuthentication();
});

async function sendAuthKey() {
    await doAuthentication({ params: { auth_key: authKey.value } });
}

async function doAuthentication(axiosRequestConfig) {
    const response=await axios.get("/api/access", axiosRequestConfig).catch((error) => {
        if(!error.response || error.response.status!==401) {
            throw error;
        }
        if(error.response && error.response.status===401) {
            emit("authentication-failed");
        }
    });
    if(response && response.status===200) {
        emit("authenticated", response.data);
    }
}
</script>