import testEvent from "./testEvent.json";
import tga2023 from "./tga2023.json";
import sonySoP202308 from "./sonySoP202308.json";

export default {
    "/test-event/index.html": {
        redirect: "/events/test-event/",
        games: testEvent,
    },
    "/the-game-awards-2023/index.html": {
        redirect: "/events/the-game-awards-2023/",
        games: tga2023,
    },
    "/state-of-play-september-2023/index.html": {
        redirect: "/events/state-of-play-september-2023/",
        games: sonySoP202308,
    },
};