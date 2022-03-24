<template>
    <div class="container">
        <div v-if="isAuthenticated">
            <router-link to="/calendar">Kalendar generieren</router-link>
        </div>

        <div v-if="!isAuthenticated" class="row mt-4">
            <api-validate-form v-model="apiKey" @authenticated="isAuthenticated = true" />
        </div>
        
        <div v-else>
            <div class="row mt-4">
                <div class="col">
                    <input type="search" v-debounce:500ms="searchGames" v-model="searchQuery" id="search-games" name="search-games" class="form-control" placeholder="Suche Game">
                </div>
            </div>

            <div class="results mt-2" v-for="result in searchResults" :key="result.id">
                <div class="row">
                    <div class="col result mt-2" :data-testid="'result-' + result.id" @click="addGame(result.id)">
                        <img v-if="result.cover && result.cover.url" 
                             :src="result.cover.url.replace('thumb', 'cover_small')" class="game-cover"
                        >
                        <div class="game-info">
                            <h5>{{ result.name }}</h5>
                            <h6>{{ result.involved_companies.find((involved_company) => involved_company.developer === true).company.name }}</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//ToDo: Refactor into Components
import axios from "axios";
import { getDirective } from "vue-debounce";

import ApiValidateForm from "../components/ApiValidateForm";

export default {
  name: "IndexView",
  directives: {
    debounce: getDirective(3)
  },
  components: {
    ApiValidateForm
  },
  data() {
    return { 
      isAuthenticated: false,
      apiKey: "",
      searchQuery: "",
      searchResults: [],
    }
  },
  async mounted() {
    const response = await axios.get("/api/access").catch((error) => {
      if (error.response && error.response.status === 401) {
        this.isAuthenticated = false;
      }
    });
    if (response && response.status === 200) {

      this.isAuthenticated = true;
    }
  },
  methods: {
    async searchGames() {
      const response = await axios.get("/api/game/search", { params: { q: this.searchQuery }});
      this.searchResults = response.data;
    },
    async addGame(id) {
      await axios.post("/api/user/y1xx/games", [id]);
    }
  },
  computed: {
  }
};
</script>

<style scoped>
    .result {
        display: flex;
        cursor: pointer;
        padding: 2px;
    }

    .result:hover {
        background-color: rgb(211, 209, 209);
    }

    .game-cover {   
        height: 100px;
    }

    .game-info {
        margin-top: 10px;
        padding-left: 10px;
    }
</style>