<template>
    <div class="container">
        <div v-if="isAuthenticated">
            <router-link to="/calendar">Kalendar generieren</router-link>
        </div>

        <div v-if="!isAuthenticated" class="row mt-4">
            <div id="g_id_onload"
                 :data-client_id="gsiAppId"
                 data-callback="onSignIn"
                 data-auto_prompt="false"
                 data-context="signup">
            </div>
            <div class="g_id_signin"
                 data-type="standard"
                 data-size="large"
                 data-theme="outline"
                 data-text="sign_in_with"
                 data-shape="rectangular"
                 data-csrf_token="token"
                 data-logo_alignment="left">
            </div>
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
import axios from "axios";

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
      gsiAppId: process.env.VUE_APP_GOOGLE_SIGN_IN_APP_ID,
      user: {},
    }
  },
  mounted() {
    const googleSignInScript = document.createElement("script");
    googleSignInScript.setAttribute("src", "https://accounts.google.com/gsi/client");
    googleSignInScript.setAttribute("async", "");
    googleSignInScript.setAttribute("defer", "");
    document.head.appendChild(googleSignInScript);

    window.onSignIn = async (response) => {  
      const loginResponse = await axios.post("/api/user/g-login", { credential: response.credential });
      this.user = loginResponse;
      this.isAuthenticated = true;
    }
  }
};
</script>
