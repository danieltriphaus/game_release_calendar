<template>
    <div class="container">
        <div v-if="!isAuthenticated" class="row mt-4">
            <template v-if="authenticationFailed">
                <div id="g_id_onload"
                     :data-client_id="gsiAppId"
                     data-context="signin"
                     data-ux_mode="popup"
                     data-callback="onSignIn">
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
            </template>
            <api-validate-form @authenticated="onAuthenticated" @authentication-failed="onAuthenticationFailed" />
        </div>
        
        <router-view v-if="isAuthenticated"/>

        <div class="row mt-4" v-if="isAuthenticated">
            <div class="col">
                <button type="button" class="btn btn-outline-danger" @click="signOut">Abmelden</button>
            </div>
        </div>
    </div>
</template>

<script>
import ApiValidateForm from "./components/ApiValidateForm";
import axios from "axios";
import { computed } from "vue";

export default {
  components: {
    ApiValidateForm,
  },
  provide() {
    return {
      userId: computed(() => this.user.id ),
      user: computed(() => this.user ),
      isAuthenticated: computed(() => this.isAuthenticated)
    }
  },
  data() {
    return {
      authenticationFailed: false,
      isAuthenticated: false,
      gsiAppId: process.env.VUE_APP_GOOGLE_SIGN_IN_APP_ID,
      user: {
        id: ""
      },
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
      this.user = loginResponse.data;
      this.isAuthenticated = true;
    }
  },
  methods: {
    onAuthenticated(user) {
      this.isAuthenticated = true;
      this.user = user;
    },
    onAuthenticationFailed() {
      this.isAuthenticated = false;
      this.authenticationFailed = true;
    },
    async signOut() {
      const response = await axios.delete("/api/access");
      if (response.status === 200) {
        await this.$router.push("/");
        window.location.reload();
      }
    }
  }
};
</script>


