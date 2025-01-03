<template>
    <div
        class="list-category"
    >
        <div
            data-bs-toggle="collapse"
            :data-bs-target="'#' + props.collapseId"
            class="list-category-heading"
        >
            <h5 class="list-heading">
                {{ props.heading }}
            </h5>
            <i
                class="list-icon"
                :class="'bi-' + accordionTabIcon"
            />
        </div>
        <div class="collapse"
            :id="props.collapseId"
            :class="{show: categoryAccordion.isOpenOnLoad }"
        >
            <slot />
        </div>
    </div>
</template>

<script setup>
import { reactive, computed, onBeforeMount, onMounted } from "vue";

const props = defineProps({
    collapseId: { type: String, default: "" },
    heading: { type: String, default: "" },
});

const categoryAccordion = reactive({
    isOpenOnLoad: false,
    icons: {
        open: "caret-up-fill",
        closed: "caret-down-fill",
    },
});

function onCollapseStateChanged(isVisible) {
    localStorage.setItem(props.collapseId + "ExpandCollapse", JSON.stringify(isVisible));
}

onBeforeMount(() => {
    if (localStorage.getItem(props.collapseId + "ExpandCollapse")) {
        categoryAccordion.isOpenOnLoad = JSON.parse(localStorage.getItem(props.collapseId + "ExpandCollapse"));
    }
});

onMounted(() => {
    const domElement = document.getElementById(props.collapseId);
    domElement.addEventListener("show.bs.collapse", () => onCollapseStateChanged(true))
    domElement.addEventListener("hide.bs.collapse", () => onCollapseStateChanged(false))
});

const accordionTabIcon = computed(() => {
    if (categoryAccordion.isOpenOnLoad === true) {
        return categoryAccordion.icons.open;
    } else {
        return categoryAccordion.icons.closed;
    }
});
</script>

<style scoped>
    .list-category {
        margin-top: 20px;
    }

    .list-category:first-child {
        margin-top: 0;
    }

    .list-category-heading {
        display: flex;
    }

    .list-icon {
        font-size: 1.25rem;
        color: var(--bs-primary);
        margin-right: 0;
        margin-left: auto;
    }

    .collapsing {
        transition: 0.75s;
    }
</style>