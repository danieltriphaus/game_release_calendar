import platformsDisplay from "../assets/platforms.json";

export const platformHelper = (data) => {
    const id = data.id;

    const config = platformsDisplay.find((element) => element.id === id);

    return {
        isSelected(selectedPlatformId) {
            return selectedPlatformId === id;
        },
        getConfiguredAbbreviation() {
            return data[config.selector] ? data[config.selector] : config.selector;
        },
        isConfigured() {
            return Boolean(config);
        },
    };
};