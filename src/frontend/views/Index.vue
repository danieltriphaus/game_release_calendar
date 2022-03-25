<template>
    <div class="container">
        <div v-if="isAuthenticated">
            <router-link to="/calendar">Kalendar generieren</router-link>
        </div>

        <div v-if="!isAuthenticated" class="row mt-4">
            <api-validate-form v-model="apiKey" @authenticated="isAuthenticated = true" />
        </div>
        
        <game-search v-else />
    </div>
</template>

<script>
import ApiValidateForm from "../components/ApiValidateForm";
import GameSearch from "../components/GameSearch";

export default {
  name: "IndexView",
  components: {
    ApiValidateForm,
    GameSearch
  },
  data() {
    return { 
      isAuthenticated: false,
    }
  },
};
</script>
