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
        <div class="row calendar-link" data-testid="calendar-link">
            <div class="col" v-if="calendarToken.length > 0">
                <a :href="calendarLink">{{ calendarLink }}</a>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "CalendarView",
    data() {
        return {
            password: "",
            calendarToken: "",
        };
    },
    computed: {
        calendarLink() {
            if (this.calendarToken) {
                return window.location.protocol + "//" + window.location.hostname 
                    + ( window.location.port !== 80 ? ":" + window.location.port : "" )
                    + "/api/user/" + process.env.VUE_APP_DEFAULT_USER + "/calendar?token=" + this.calendarToken;
            } else {
                return "";
            }
        }
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
                console.log(response.data);
                this.calendarToken = response.data;
            }
        }
    }
}
</script>