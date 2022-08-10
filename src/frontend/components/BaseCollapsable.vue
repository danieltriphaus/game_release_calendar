<template>
    <div
        v-b-toggle="props.collapseId"
        class="list-category"
    >
        <h5 class="list-heading mt-4">
            {{ props.heading }}
        </h5>
        <i
            class="list-icon mt-4"
            :class="'bi-' + accordionTabIcon"
        />
    </div>
    <b-collapse
        :id="props.collapseId"
        :visible="categoryAccordion.isVisible"
        @hide="onCollapseStateChanged(false)"
        @show="onCollapseStateChanged(true)"
    >
        <slot />
    </b-collapse>
</template>

<script setup>
import { reactive, computed, onBeforeMount } from "vue";

const props = defineProps({
    collapseId: { type: String, default: "" },
    heading: { type: String, default: "" },
});

const categoryAccordion = reactive({
    isVisible: false,
    icons: {
        open: "caret-up-fill",
        closed: "caret-down-fill",
    },
});

function onCollapseStateChanged(state) {
    categoryAccordion.isVisible = state;
    localStorage.setItem(props.collapseId + "ExpandCollapse", JSON.stringify(categoryAccordion.isVisible));
}

onBeforeMount(() => {
    if (localStorage.getItem(props.collapseId + "ExpandCollapse")) {
        categoryAccordion.isVisible = JSON.parse(localStorage.getItem(props.collapseId + "ExpandCollapse"));
    }
});

const accordionTabIcon = computed(() => {
    if (categoryAccordion.isVisible === true) {
        return categoryAccordion.icons.open;
    } else {
        return categoryAccordion.icons.closed;
    }
});

</script>

<style scoped>
    .list-category {
        display: flex;
    }

    .list-icon {
        font-size: 1.25rem;
        color: var(--bs-primary);
        margin-right: 0;
        margin-left: auto;
    }
</style>