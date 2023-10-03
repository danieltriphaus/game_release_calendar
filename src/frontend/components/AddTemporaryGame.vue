<template>
    <div class="row">
        <template v-if="isTempGameInput">
            <div class="col">
                <div class="input-group">
                    <input
                        id="temp-game-name"
                        v-model="temporaryGame.name"
                        type="text"
                        data-cy="temp-game-name"
                        data-test="temp-game-name"
                        placeholder="Add a temporary entry"
                        class="form-control"
                    >
                    <div class="input-group-append">
                        <button
                            type="button"
                            data-cy="add-temp-game-to-list"
                            data-test="add-temp-game"
                            class="btn btn-outline-primary"
                            @click="addTemporaryGame"
                        >
                            <i class="bi bi-check2-square" />
                        </button>
                    </div>
                    <div class="input-group-append">
                        <button
                            type="button"
                            class="btn btn-outline-danger"
                            data-test="cancel-input"
                            @click="endTemporaryGameInput"
                        >
                            <i class="bi bi-x" />
                        </button>
                    </div>
                </div>
            </div>
        </template>
        <div
            v-else
            class="col"
        >
            <button
                type="button"
                data-cy="add-temp-game"
                data-test="open-temp-game-control"
                class="btn btn-outline-primary"
                @click="isTempGameInput = true;"
            >
                Game not found?
            </button>
        </div>
    </div>
</template>

<script setup>
//@ts-check

import { ref, reactive, inject } from "vue";
import { nanoid } from "nanoid";
import { apiClient } from "../library/apiClient";

const emit = defineEmits(["game-added"]);
const userId = inject("userId");
const { gameListId } = inject("gameListId");

const isTempGameInput = ref(true);

const temporaryGame = reactive({
    id: "",
    name: "",
    matched: null,
});

function addTemporaryGame() {
    temporaryGame.id = nanoid();
    Promise.all([
        apiClient.game.post({ ...temporaryGame }),
        apiClient.user(userId.value).games.post([{ id: temporaryGame.id }], gameListId.value),
    ]).then(() => {
        emit("game-added");
    });
    endTemporaryGameInput();
}

function endTemporaryGameInput() {
    temporaryGame.id = "";
    temporaryGame.name = "";
}
</script>

<style scoped>

</style>