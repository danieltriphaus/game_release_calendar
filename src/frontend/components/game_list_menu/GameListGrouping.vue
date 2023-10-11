<template>
    <div>
        <b-button
            data-test="monthly-grouping"
            :disabled="buttonsDisabled"
            @click="setGrouping('months')"
        >
            By Month
        </b-button>
        <b-button
            data-test="released-grouping"
            :disabled="buttonsDisabled"
            @click="setGrouping('released_unreleased')"
        >
            Released & Unreleased
        </b-button>
        <b-button
            data-test="no-grouping"
            :disabled="buttonsDisabled"
            @click="setGrouping('no-grouping')"
        >
            No Grouping
        </b-button>
        <h6 v-if="gameListId === 'archive'">
            Grouping not available in Archive
        </h6>
    </div>
</template>


<script setup>
import { inject, computed } from "vue";

const gameListId = inject("gameListId");

const buttonsDisabled = computed(() => {
    return gameListId.value === "archive";
});

const emits = defineEmits(["change-grouping"]);

function setGrouping(grouping) {
    emits("change-grouping", grouping);
}
</script>