<template>
    <div class="container">
        <div v-if="!isAuthenticated" class="row mt-4">
            <form name="api-validate" @submit.prevent="validateApiKey">
                <div class="col-md-10">
                    <input type="password" id="api-key" name="api-key" class="form-control" placeholder="API Key" v-model="apiKey">
                </div>
                <div class="col-md-2">
                    <input type="submit" class="btn btn-outline-primary" data-testid="api-validate">
                </div>
            </form>
        </div>
        
        <div v-else class="row mt-4">
            <div class="col">
                <input type="search" id="search-games" name="search-games" class="form-control" placeholder="Suche Game">
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
  name: "IndexView",
  components: {
  },
  data() {
    return { isAuthenticated: false, apiKey: "" }
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
    async validateApiKey() {
      const form = new FormData();
      form.append("apiKey", this.apiKey);
      const response = await axios.post("/api/access", form).catch((error) => {console.log(error)});
      if (response) {
        this.isAuthenticated = true;
      }
    }
  }
};
</script>
