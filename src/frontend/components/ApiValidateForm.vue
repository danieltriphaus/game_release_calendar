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

    const props = defineProps(['modelValue']);
    const emit = defineEmits(["update:modelValue", "authenticated"]);

    async function validateApiKey() {
      const form = new FormData();
      form.append("apiKey", props.modelValue);
      const response = await axios.post("/api/access", form).catch((error) => {console.log(error)});
      if (response) {
        emit("authenticated");
      }
    }
</script>