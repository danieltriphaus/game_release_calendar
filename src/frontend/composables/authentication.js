import { apiClient } from "../library/apiClient";
import { ref } from "vue";

export const useAuthentication = async () => {
    const isAuthenticated = ref(false);
    const authenticationFailed = ref(false);

    const user = ref(await apiClient.access.get());
    if (user.value) {
        isAuthenticated.value = true;
    } else {
        isAuthenticated.value = false;
        authenticationFailed.value = true;
    }

    return { isAuthenticated, authenticationFailed, user };
};