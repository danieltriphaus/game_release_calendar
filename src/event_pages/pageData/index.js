import testEvent from "./testEvent.json";
import tga2023 from "./tga2023.json";

export default {
    "/test-event/index.html": {
        redirect: "/events/test-event/",
        games: testEvent,
    },
    "/the-game-awards-2023/index.html": {
        redirect: "/events/the-game-awards-2023/",
        games: tga2023,
    },
};