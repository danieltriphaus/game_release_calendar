<template>
    <div>
        <b-button
            v-b-modal.calendar-control
            variant="primary"
            data-cy="get-calendar"
        >
            Get Calendar
        </b-button>
        <b-modal
            id="calendar-control"
            hide-footer
            @show="getCalendarLink"
        >
            <b-container fluid>
                <b-row class="mt-2">
                    <b-button
                        v-if="!calendar.token"
                        variant="secondary"
                        data-cy="get-calendar-link"
                        @click="getCalendarLink"
                    >
                        <i class="bi bi-link me-2" />Get a Link
                        <b-spinner
                            v-if="isGettingLink"
                            small
                        />
                    </b-button>
                </b-row>
                <b-form-group
                    v-if="calendar.token"
                    class="mt-2"
                    label="Subscription Link"
                    label-for="calendar-link"
                >
                    <b-form-input
                        id="calendar-link"
                        v-model="calendarLink"
                        disabled
                        data-cy="calendar-link"
                    />
                </b-form-group>
                <b-row class="mt-2">
                    <b-button
                        v-if="calendar.token"
                        :href="calendarLink"
                        variant="secondary"
                        download
                        data-cy="download-calendar"
                    >
                        <i class="bi bi-file-earmark-arrow-down me-2" />Download
                    </b-button>
                </b-row>
            </b-container>
        </b-modal>
    </div>
</template>

<script setup>
import { inject, ref, computed } from "vue";
import { apiClient } from "../library/apiClient";

const USER_API_PATH = "/api/user/";

const user = inject("user");
const calendar = ref({ list: "", token: "" });
const isGettingLink = ref(false);

const calendarLink = computed(() => {
    return window.location.protocol + "//" + window.location.host + USER_API_PATH + user.value.id + "/calendar?token=" + calendar.value.token;
});

async function getCalendarLink() {
    isGettingLink.value = true;
    let defaultCalendar;
    try {
        defaultCalendar = await getDefaultCalendar();
    } catch (error) {
        if (error.response && error.response.status === 404) {
            defaultCalendar = await createAndGetDefaultCalendar();
        } else {
            throw error;
        }
    }

    calendar.value = defaultCalendar;
    isGettingLink.value = false;
}

async function getDefaultCalendar() {
    const calendars = await apiClient.user(user.value.id).calendars.get();
    return calendars[0];
}

async function createAndGetDefaultCalendar() {
    return await apiClient.user(user.value.id).calendar.post();
}

</script>