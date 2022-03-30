<template>
    <div class="container">
        <div v-if="isAuthenticated">
            <router-link to="/calendar">Kalendar generieren</router-link>
        </div>

        <div v-if="!isAuthenticated" class="row mt-4">
            <api-validate-form @authenticated="isAuthenticated = true" />
        </div>
        
        <template v-else>
            <game-search />
            <game-list />
        </template>
    </div>
</template>

<script>
import ApiValidateForm from "../components/ApiValidateForm";
import GameSearch from "../components/GameSearch";
import GameList from "../components/GameList";

export default {
  name: "IndexView",
  components: {
    ApiValidateForm,
    GameSearch,
    GameList
  },
  data() {
    return { 
      isAuthenticated: false,
    }
  },
};
</script>
