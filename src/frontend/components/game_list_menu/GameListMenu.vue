<template>
    <div>
        <div class="row ms-0">
            <ul
                class="list-actions col-9"
                data-test="list-actions"
                @click="onListMenuClick"
            >
                <li
                    v-for="(item, id) in listMenuNew"
                    :id="id"
                    :key="id"
                    :class="{ active: item.active }"
                >
                    {{ item.title }}
                </li>
            </ul>
            <div class="col-3 text-end">
                <button
                    type="button"
                    class="btn btn-outline-primary mt-2 mb-2"
                    title="Refresh Games Data"
                    @click="$emit('refresh-games')"
                >
                    <i class="bi bi-arrow-clockwise" />
                </button>
            </div>
            <div
                class="list-actions-content p-0"
            >
                <template v-for="(item, id) in listMenuNew">
                    <component
                        :is="item.component"
                        v-if="item.active"
                        :key="id"
                        :games="games"
                        :data-test="id"
                        @game-added="$emit('game-added')"
                        @delete-game="$emit('delete-game')"
                        @change-grouping="$emit('change-grouping', $event)"
                        @show-archive="$emit('show-archive')"
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, shallowRef } from "vue";
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

defineEmits(["game-added", "delete-game", "change-grouping", "show-archive", "refresh-games"]);

const listMenuNew = ref({
    temporary_game: {
        active: false,
        component: shallowRef(AddTemporaryGame),
        title: "Game not found?",
    },
    calendar: {
        active: false,
        component: shallowRef(CalendarControl),
        title: "Calendar",
    },
    archive: {
        active: false,
        component: shallowRef(ArchiveControl),
        title: "Archive",
    },
    grouping: {
        active: false,
        component: shallowRef(GameListGrouping),
        title: "Grouping",
    },
});

if (user.value.event_admin) {
    listMenuNew.value.events = {
        active: false,
        component: shallowRef(EventLists),
        title: "Events",
    };
}

function onListMenuClick(event) {
    Object.keys(listMenuNew.value).forEach((key) => {
        if ((key === event.target.id && listMenuNew.value[event.target.id].active === true) || (key !== event.target.id)) {
            listMenuNew.value[key].active = false;
        } else if (key === event.target.id) {
            listMenuNew.value[key].active = true;
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

.list-actions-content > * {
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