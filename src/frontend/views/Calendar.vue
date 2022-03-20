<template>
    <div class="container">
        <form class="row" name="generate-calendar" @submit.prevent="createCalendar">
            <div class="col-md-10">
                <input type="password" id="api-key" name="api-key" class="form-control" placeholder="Password" v-model="password">
            </div>
            <div class="col-md-2">
                <input type="submit" class="btn btn-outline-primary" data-testid="create-calendar">
            </div>
        </form>

        <div v-for="calendar in calendars" :key="calendar.token" class="row calendar-link" data-testid="calendar-link">
            <calendar-link :calendar="calendar" />
        </div>
    </div>
</template>

<script>
import axios from "axios";
import CalendarLink from "../components/CalendarLink";

export default {
    name: "CalendarView",
    components: {
        CalendarLink
    },
    data() {
        return {
            password: "",
            calendarToken: "",
            calendars: [],
        };
    },
    async mounted() {
        const response = await axios.get("/api/user/" + process.env.VUE_APP_DEFAULT_USER + "/calendars");
        this.calendars = response.data;
    },
    methods: {
        async createCalendar() {
            const response = await axios
                .post("/api/user/" + process.env.VUE_APP_DEFAULT_USER + "/calendar", { password: this.password })
                .catch((error) => {
                    if (error.response && error.response.status === 401) {
                        console.log("unauthorized");
                    } else {
                        throw error;
                    }
                });
            if (response) {
                this.calendarToken = response.data;
                this.calendars.push({ token: this.calendarToken });
            }
        }
    }
}
</script>