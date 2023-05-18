<template>
    <div>
        <b-button
            data-test="monthly-grouping"
            @click="setGrouping('months')"
        >
            By Month
        </b-button>
        <b-button
            data-test="released-grouping"
            @click="setGrouping('released-unreleased')"
        >
            Released & Unreleased
        </b-button>
    </div>
</template>


<script setup>
const emits = defineEmits(["change-grouping"]);

function setGrouping(grouping) {
    emits("change-grouping", grouping);
}
</script>