<template>
    <div class="col">
        <a :href="calendarLink">{{ calendarLink }}</a>
    </div>
</template>

<script>
export default {
    name: "CalendarLink",
    inject: ["user"],
    props: {
        calendar: {
            type: Object,
            default() {
                return {
                    token: "",
                };
            },
        },
    },
    computed: {
        calendarLink() {
            return window.location.protocol + "//" + window.location.hostname
                + (window.location.port !== 80 ? ":" + window.location.port : "")
                + "/api/user/" + this.user.id + "/calendar?token=" + this.calendar.token;
        },
    },
};
</script>