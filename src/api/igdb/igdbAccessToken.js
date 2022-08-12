import axios from "axios";

let accessToken = {
    access_token: "",
    expires_in: 0,
    token_type: "",
};

export const getIgdbAccessToken = async () => {
    if (accessToken.access_token.length === 0) {
        const response = await axios
            .post(
                "https://id.twitch.tv/oauth2/token?client_id=" +
                    process.env.IGDB_API_CLIENT_ID +
                    "&client_secret=" +
                    process.env.IGDB_API_CLIENT_SECRET +
                    "&grant_type=client_credentials",
            )
            .catch((error) => {
                console.warn("Warning: igdb Access Token could not be obtained");
                console.error(error);
            });

        if (response) {
            accessToken = response.data;
            console.log("igdb Access Token sucessfully obtained " + accessToken.access_token);
            return response.data;
        }
    } else {
        return accessToken;
    }
};

export const clearLocalAccessToken = () => {
    accessToken = {
        access_token: "",
        expires_in: 0,
        token_type: "",
    };
};
