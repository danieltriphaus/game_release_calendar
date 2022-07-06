<template>
    <b-button v-b-modal.calendar-control variant="primary" data-cy="get-calendar">Get Calendar</b-button>
    <b-modal id="calendar-control" hide-footer @show="getCalendarLink">
        <b-container fluid>
            <b-row class="mt-2">
                <b-button v-if="!calendar.token" variant="secondary" @click="getCalendarLink" data-cy="get-calendar-link">
                    <i class="bi bi-link me-2"></i>Get a Link
                    <b-spinner v-if="isGettingLink" small></b-spinner>
                </b-button>
            </b-row>
            <b-form-group 
                v-if="calendar.token" class="mt-2"
                label="Subscription Link"
                label-for="calendar-link"
            >
                <b-form-input id="calendar-link" v-model="calendarLink" disabled data-cy="calendar-link" ></b-form-input>
            </b-form-group>
            <b-row class="mt-2"><b-button :href="calendarLink" v-if="calendar.token" variant="secondary" download data-cy="download-calendar"><i class="bi bi-file-earmark-arrow-down me-2"></i>Download</b-button></b-row>
        </b-container>
    </b-modal>
</template>

<script setup>
    import axios from 'axios';
    import { inject, ref, computed } from "vue";

    const user = inject("user");
    const calendar = ref({list: "", token: ""});
    const isGettingLink = ref(false);

    const calendarLink = computed(() => {
        return window.location.protocol + "//" + window.location.host + "/api/user/" + user.value.id + "/calendar?token=" + calendar.value.token;
    });

    async function getCalendarLink() 
    {
        isGettingLink.value = true;
        const response = await axios.get("/api/user/" + user.value.id + "/calendars");
        if (response) {
            calendar.value = response.data.find((calendar) => calendar.list === "default");
        }
        isGettingLink.value = false;
    }
</script>