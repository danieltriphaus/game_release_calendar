<template>
    <div class="row">
        <template v-if="isTempGameInput">
            <div class="col">
                <div class="input-group">
                    <input
                        v-model="temporaryGame.name"
                        type="text"
                        data-cy="temp-game-name"
                        data-test="temp-game-name"
                        placeholder="Add a temporary entry to your list"
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
import { ref, reactive, inject } from "vue";
import { nanoid } from "nanoid";
import axios from "axios";

const emit = defineEmits(["game-added"]);
const userId = inject("userId");

const isTempGameInput = ref(true);

const temporaryGame = reactive({
    id: "",
    name: "",
    matched: null,
});

function addTemporaryGame() {
    temporaryGame.id = nanoid();
    axios.post("/api/game", { ...temporaryGame });
    axios.post("/api/user/" + userId.value + "/games", { games: [{ id: temporaryGame.id }] });
    emit("game-added", { ...temporaryGame });
    endTemporaryGameInput();
}

function endTemporaryGameInput() {
    temporaryGame.id = "";
    temporaryGame.name = "";
}
</script>