<template>
    <span />
</template>

<script setup>
    import axios from "axios";
    import { onMounted } from "vue";

    const emit = defineEmits(["authenticated", "authentication-failed"]);

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
</script>