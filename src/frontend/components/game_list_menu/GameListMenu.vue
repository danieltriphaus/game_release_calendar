<template>
    <div>
        <ul
            class="list-actions"
            data-test="list-actions"
            @click="onListMenuClick"
        >
            <li
                id="temporary_game"
                :class="{ active: listMenu.temporary_game }"
            >
                Game not found?
            </li>
            <li
                id="calendar"
                :class="{ active: listMenu.calendar }"
            >
                Calendar
            </li>
            <li
                id="archive"
                :class="{ active: listMenu.archive }"
            >
                Archive
            </li>
            <li
                id="grouping"
                :class="{ active: listMenu.grouping }"
            >
                Grouping
            </li>
            <li
                v-if="user.event_admin"
                id="events"
                :class="{ active: listMenu.events }"
            >
                Events
            </li>
        </ul>

        <div
            class="list-actions-content"
        >
            <AddTemporaryGame
                v-if="listMenu.temporary_game"
                data-test="add-temp-game"
                @game-added="$emit('game-added')"
            />
            <CalendarControl
                v-else-if="listMenu.calendar"
                data-test="calendar-control"
            />
            <ArchiveControl
                v-else-if="listMenu.archive"
                data-test="archive-control"
                :games="games"
                @delete-game="$emit('delete-game')"
                @show-archive="$emit('show-archive')"
            />
            <GameListGrouping
                v-else-if="listMenu.grouping"
                @change-grouping="$emit('change-grouping', $event)"
            />
            <EventLists
                v-else-if="listMenu.events && user.event_admin"
                data-test="events-control"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, inject } from "vue";
import AddTemporaryGame from "./AddTemporaryGame.vue";
import CalendarControl from "./CalendarControl.vue";
import ArchiveControl from "./ArchiveControl.vue";
import GameListGrouping from "./GameListGrouping.vue";
import EventLists from "./EventLists.vue";

defineProps({
    games: {
        type: Array,
        default: () => [],
    },
});

const user = inject("user");

defineEmits(["game-added", "delete-game", "change-grouping", "show-archive"]);

const listMenu = ref({
    temporary_game: false,
    calendar: false,
    archive: false,
    grouping: false,
    events: false,
});

function onListMenuClick(event) {
    Object.keys(listMenu.value).forEach((key) => {
        if (key === event.target.id && listMenu.value[event.target.id] === true) {
            listMenu.value[key] = false;
        } else if (key === event.target.id) {
            listMenu.value[key] = true;
        } else if (key !== event.target.id) {
            listMenu.value[key] = false;
        }
    });
}
</script>

<style scoped>
.list-actions {
	margin: 0;
	padding: 0;
    margin-top: 15px;
    margin-bottom: 15px;
}

.list-actions-content {
    margin-bottom: 15px;
}

.list-actions li {
	display: inline-block;
	margin-right: 0.3rem;
	background-color: var(--bs-primary);
	cursor: pointer;
    padding: 4px 11px;
    border-radius: 20px;
    font-size: 0.8rem;
    color: white;
    font-weight: bold;
    transition: background-color 0.3s ease-in-out;
}

.list-actions li.active {
    background-color: white;
    color: var(--bs-primary);
    border: 2px solid var(--bs-primary);
    padding: 2px 9px;
}
</style>