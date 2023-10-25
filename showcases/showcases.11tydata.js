const { getIgdbAccessToken } = require("../js/igdbAccessToken");

module.exports = async function () {
    const accessToken = await getIgdbAccessToken();

    return {
        sop: [
            {
                title: "Sony State of Play September 2023 - New looks at Final Fantasy VII Rebirth, Resident Evil 4 VR Mode, Avatar:Frontiers of Pandora and many more.",
                headline: "Sony State of Play September 2023 <br> All announcements from the showcase",
                description: "New looks at Final Fantasy VII Rebirth, Resident Evil 4 VRMode, Avatar: Frontiers of Pandora and every other announcement on one page",
                additional_info: "For all the trailers and more Info check out <a href='https://blog.playstation.com/2023/09/14/state-of-play-september-2023-all-trailers-and-complete-recap/' target='_blank'>the official Post on the Playstation Blog</a>",
                name: "september-2023"
            }
        ]
    }
}