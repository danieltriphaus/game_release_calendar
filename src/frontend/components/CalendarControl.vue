<template>
    <div>
        <b-row class="mt-2">
            <b-col class="text-center">
                <b-spinner
                    v-if="isGettingLink"
                />
            </b-col>
        </b-row>
        <b-form-group
            v-if="calendar.token"
            label="Subscription Link"
            label-for="calendar-link"
        >
            <b-input-group>
                <b-form-input
                    id="calendar-link"
                    v-model="calendarLink"
                    disabled
                    data-cy="calendar-link"
                />
                <template #append>
                    <b-button
                        variant="secondary"
                        @click="copyCalendarLink"
                    >
                        <i class="bi bi-clipboard" />
                    </b-button>
                </template>
            </b-input-group>
        </b-form-group>
        <b-row class="mt-2">
            <b-col>
                <b-button
                    v-if="calendar.token"
                    :href="calendarLink"
                    variant="secondary"
                    download
                    data-cy="download-calendar"
                >
                    <i class="bi bi-file-earmark-arrow-down me-2" />Download
                </b-button>
            </b-col>
        </b-row>
    </div>
</template>

<script setup>
import { inject, ref, computed, onMounted } from "vue";
import { apiClient } from "../library/apiClient";

const USER_API_PATH = "/api/user/";

const user = inject("user");
const calendar = ref({ list: "", token: "" });
const isGettingLink = ref(false);

const calendarLink = computed(() => {
    return window.location.protocol + "//" + window.location.host + USER_API_PATH + user.value.id + "/calendar?token=" + calendar.value.token;
});

onMounted(() => {
    getCalendarLink();
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

function copyCalendarLink() {
    navigator.clipboard.writeText(calendarLink.value);
}

async function getDefaultCalendar() {
    const calendars = await apiClient.user(user.value.id).calendars.get();
    return calendars[0];
}

async function createAndGetDefaultCalendar() {
    return await apiClient.user(user.value.id).calendar.post();
}

</script>