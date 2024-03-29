import axios from "axios";
//import { apiClient } from "../frontend/library/apiClient";

[...document.getElementsByClassName("release-date")].forEach((element) => {
    if (element.textContent.indexOf("/") !== -1) {
        const releaseDate = new Date(element.textContent);
        if (releaseDate) {
            element.textContent = releaseDate.toLocaleDateString(navigator.language, { year: "numeric", month: "2-digit", day: "2-digit" });
        }
    }
});

if (import.meta.env.MODE === "development") {
    axios.defaults.baseURL = "http://localhost:3000";

    [...document.getElementsByTagName("a")].forEach((element) => {
        if (element.getAttribute("href")?.startsWith("/") && !element.getAttribute("href")?.startsWith("/app")) {
            element.setAttribute("href", "http://localhost:3000" + element.getAttribute("href"));
        }
    });
}

document.getElementById("to-top-button")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("load", async () => {
    const response = await axios.get("/api/access/").catch((error) => {
        if (error.response && error.response.status === 401) {
            return;
        }
        throw error;
    });
    if (response) {
        changeLinksForAuthenticatedUser();
        addEventListenerToButtons(response.data.id);
    }
});

function changeLinksForAuthenticatedUser() {
    const topLink = document.getElementById("register-top-link");
    topLink.innerHTML = "Go to app";
    [...document.getElementsByClassName("add-game")].forEach((element) => {
        element.removeAttribute("href");
    });
}

function addEventListenerToButtons(userId) {
    [...document.getElementsByClassName("add-game")].forEach((element) => {
        element.addEventListener("click", async (event) => {
            const parentNode = event.target.parentNode;
            caches.open("gamestache-user-games").then((cache) => {
                cache.delete("/api/user/" + userId + "/games?listId=default");
            });
            await axios.post("/api/user/" + userId + "/games", { games: [{ id: parseInt(parentNode.getAttribute("data-game-id")) }] });
            parentNode.classList.add("disabled");
            const title = parentNode.closest(".game").querySelector(".game-info h5").textContent;
            document.getElementById("alert-wrapper").innerHTML = "<div class=\"alert alert-success alert-dismissible\" role=\"alert\">" + title + " added to your list<button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button></div>";
        });
    });
}


