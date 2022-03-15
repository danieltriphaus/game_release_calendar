import { createRouter, createWebHistory } from "vue-router";
import Index from "../views/Index.vue";
import Calendar from "../views/Calendar.vue";

const routes = [
    {
        path: "/",
        name: "index",
        component: Index,
    },
    {
        path: "/calendar",
        name: "calendar",
        component: Calendar,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
