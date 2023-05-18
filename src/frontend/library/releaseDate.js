export const getSelectedReleaseDate = (game) => {
    let selectedReleaseDate;
    if (game.selectedPlatform) {
        selectedReleaseDate = game.release_dates.find((releaseDate) => releaseDate.platform.id === game.selectedPlatform);
    } else {
        selectedReleaseDate = game.release_dates.find((date) => date.date === game.first_release_date);
    }
    return selectedReleaseDate;
};