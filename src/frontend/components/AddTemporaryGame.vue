<template>
    <div class="row mt-2">
        <template v-if="isTempGameInput">
            <div class="col">
                <div class="input-group">
                    <input
                        v-model="temporaryGame.name"
                        type="text"
                        data-cy="temp-game-name"
                        placeholder="Name"
                        class="form-control"
                    >
                    <div class="input-group-append">
                        <button
                            type="button"
                            data-cy="add-temp-game-to-list"
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

const isTempGameInput = ref(false);

const temporaryGame = reactive({
    id: "",
    name: "",
});

function addTemporaryGame() {
    temporaryGame.id = nanoid();
    axios.post("/api/game", temporaryGame);
    axios.post("/api/user/" + userId.value + "/games", [temporaryGame.id]);
    emit("game-added", {...temporaryGame});
    endTemporaryGameInput();
}

function endTemporaryGameInput() {
    isTempGameInput.value = false;
    temporaryGame.id = "";
    temporaryGame.name = "";
}
</script>