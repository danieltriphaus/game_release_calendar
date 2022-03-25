<template>
    <form name="api-validate" @submit.prevent="validateApiKey">
        <div class="col-md-10">
            <input 
                type="password" 
                id="api-key" 
                name="api-key" 
                class="form-control" 
                placeholder="API Key" 
                :value="modelValue" 
                @input="$emit('update:modelValue', $event.target.value)"
            >
        </div>
        <div class="col-md-2">
            <input type="submit" class="btn btn-outline-primary" data-testid="api-validate">
        </div>
    </form>
</template>

<script setup>
    import axios from "axios";
    import { onMounted } from "vue";

    const props = defineProps(['modelValue']);
    const emit = defineEmits(["update:modelValue", "authenticated"]);

    onMounted(async () => {
        const response = await axios.get("/api/access").catch((error) => {
            if (!error.response || error.response.status !== 401) {
                throw error;
            }
        });
        if (response && response.status === 200) {
            emit("authenticated");
        }
    });

    async function validateApiKey() {
      const form = new FormData();
      form.append("apiKey", props.modelValue);
      const response = await axios.post("/api/access", form).catch((error) => {
          if (!error.response || error.response.status !== 401) {
                throw error;
            }
      });
      if (response) {
        emit("authenticated");
      }
    }
</script>