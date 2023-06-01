<template>
    <div class="container">
        <div
            v-if="isAuthenticated"
            class="row"
        >
            <div class="col-3 offset-9 text-end">
                <!-- <UserMenu /> -->
            </div>
        </div>
        <div
            v-show="!isAuthenticated"
            class="row mt-4"
        >
            <div v-if="authenticationFailed">
                <b-button
                    :href="signInUrl"
                    variant="primary"
                >
                    Sign in with Google
                </b-button>
                <div
                    id="g_id_onload"
                    :data-client_id="gsiAppId"
                    data-context="signin"
                    data-ux_mode="popup"
                    data-callback="onSignIn"
                />

                <div
                    class="g_id_signin"
                    data-type="standard"
                    data-shape="rectangular"
                    data-theme="outline"
                    data-text="signin_with"
                    data-size="large"
                    data-logo_alignment="left"
                />
            </div>

            <api-validate-form
                @authenticated="onAuthenticated"
                @authentication-failed="onAuthenticationFailed"
            />
        </div>
        <router-view v-if="isAuthenticated" />
    </div>
</template>

<script>
import ApiValidateForm from "./components/ApiValidateForm";
import { apiClient } from "./library/apiClient";
import { computed } from "vue";

export default {
    components: {
        ApiValidateForm,
    },
    provide() {
        return {
            userId: computed(() => this.user.id),
            user: computed(() => this.user),
            isAuthenticated: computed(() => this.isAuthenticated),
        };
    },
    data() {
        return {
            authenticationFailed: false,
            isAuthenticated: false,
            gsiAppId: import.meta.env.VITE_GOOGLE_SIGN_IN_APP_ID,
            user: {
                id: "",
            },
        };
    },
    computed: {
        signInUrl() {
            return `http://localhost:3000/login/google`;
        },
    },
    mounted() {
        const googleSignInScript = document.createElement("script");
        googleSignInScript.setAttribute("src", "https://accounts.google.com/gsi/client");
        googleSignInScript.setAttribute("async", "");
        googleSignInScript.setAttribute("defer", "");
        document.head.appendChild(googleSignInScript);

        window.onSignIn = async (response) => {
            this.user = await apiClient.user().gLogin.post(response.credential);
            if (this.user.id) {
                this.isAuthenticated = true;
            }
        };
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
        // async signOut() {
        //     if (await apiClient.access.delete()) {
        //         await this.$router.push("/");
        //         window.location.reload();
        //     }
        // },
    },
};
</script>