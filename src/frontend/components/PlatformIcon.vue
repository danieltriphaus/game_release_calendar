<template>
    <span
        class="platform platform-selector"
        :class="[{ selected }, platform]"
        :title="title"
    >
        {{ platform.toUpperCase() }}
    </span>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
const props = defineProps({
    platform: {
        type: String,
        default() {
            return "";
        },
    },
    selected: Boolean,
    title: {
        type: String,
        default() {
            return "";
        },
    },
});

</script>

<style scoped>
    .platform {
        display: inline-block;
        padding: 2px 4px;
        margin-right: 1px;
        margin-top: 1px;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
    }

    .platform.PS5 {
        background-color:#30405080;
    }

    .platform.PS5.selected {
        background-color: #304050;
    }

    .platform.XSX {
        background-color: #107c1093;
    }

    .platform.XSX.selected {
        background-color: #107C10;
    }

    .platform.NX {
        background-color: #e6001370;
    }

    .platform.NX.selected {
        background-color: #e60012;
    }
</style>