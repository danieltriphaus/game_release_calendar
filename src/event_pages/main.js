import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/css/global.css";

[...document.getElementsByClassName("release-date")].forEach((element) => {
    const releaseDate = element.getAttribute("data-release-date");
    const releaseDateObject = new Date(releaseDate * 1000);
    element.textContent = releaseDateObject.toLocaleDateString(navigator.language, { year: "numeric", month: "2-digit", day: "2-digit" });
});