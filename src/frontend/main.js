import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { BootstrapVue3 } from "bootstrap-vue-3";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/global.css";

const app = createApp(App);
app.config.unwrapInjectedRef = true;
app.use(BootstrapVue3);
app.use(router).mount("#app");

//ToDo: Migrate from VUE CLI to Vite
//ToDo: Migrate to Cypress 10
