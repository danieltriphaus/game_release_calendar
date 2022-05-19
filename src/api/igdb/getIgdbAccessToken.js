import axios from "axios";

export const getIgdbAccessToken = async () => {
    const response = await axios
        .post(
            "https://id.twitch.tv/oauth2/token?client_id=" +
                process.env.IGDB_API_CLIENT_ID +
                "&client_secret=" +
                process.env.IGDB_API_CLIENT_SECRET +
                "&grant_type=client_credentials"
        )
        .catch((error) => {
            throw error;
        });

    return response.data;
};
