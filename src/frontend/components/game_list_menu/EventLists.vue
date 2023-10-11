<template>
    <div>
        <button
            v-for="list in lists"
            :key="list.id"
            type="button"
            class="btn btn-primary"
            @click="changeGameListId(list.id)"
        >
            {{ list.id }}
        </button>
        <div class="input-group">
            <input
                v-model="newListId"
                type="text"
                class="form-control"
                placeholder="New List ID"
            >
            <button
                type="button"
                class="btn btn-primary"
                @click="addList"
            >
                Add List
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { apiClient } from "../../library/apiClient";

const { changeGameListId } = inject("gameListId");
const user = inject("user");
const lists = ref([]);

onMounted(async () => {
    lists.value = await apiClient.user(user.value.id).lists.get();
});

const newListId = ref("");
async function addList() {
    await apiClient.user(user.value.id).lists.post([{ id: newListId.value }]);
    newListId.value = "";
    lists.value = await apiClient.user(user.value.id).lists.get();
}
</script>