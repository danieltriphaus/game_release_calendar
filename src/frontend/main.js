import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.min.css";

const app = createApp(App);
app.config.unwrapInjectedRef = true;
app.use(router).mount("#app");
