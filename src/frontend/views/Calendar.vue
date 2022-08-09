<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <button
                    type="button"
                    class="btn btn-outline-primary"
                    @click="createCalendar"
                >
                    Kalender erstellen
                </button>
            </div>
        </div>

        <div
            v-for="calendar in calendars"
            :key="calendar.token"
            class="row calendar-link"
            data-testid="calendar-link"
        >
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
        CalendarLink,
    },
    inject: ["user"],
    data() {
        return {
            password: "",
            calendarToken: "",
            calendars: [],
        };
    },
    async mounted() {
        if (this.user.id.length > 0) {
            const response = await axios.get("/api/user/" + this.user.id + "/calendars");
            this.calendars = response.data;
        }
    },
    methods: {
        async createCalendar() {
            const response = await axios.post("/api/user/" + this.user.id + "/calendar");
            if (response) {
                this.calendarToken = response.data;
                this.calendars.push({ token: this.calendarToken });
            }
        },
    },
};
</script>