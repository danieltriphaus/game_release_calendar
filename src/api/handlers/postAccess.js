import axios from "axios";

const COOKIE_OPTIONS = {
    httpOnly: true,
};

export const postAccess = async (context, req, res) => {
    if (req.body.apiKey === process.env.API_KEY) {
        const response = await axios
            .post(
                "https://id.twitch.tv/oauth2/token?client_id=" +
                    process.env.IGDB_API_CLIENT_ID +
                    "&client_secret=" +
                    process.env.IGDB_API_CLIENT_SECRET +
                    "&grant_type=client_credentials"
            )
            .catch((error) => {
                if (error.response) {
                    res.status(error.response.data.status).json({
                        error: "external_request",
                        message: error.response.data.message,
                    });
                }
            });

        if (response) {
            res.cookie("api_key", req.body.apiKey, {
                maxAge: response.data.expires_in * 1000,
                ...COOKIE_OPTIONS,
            });

            res.cookie("igdb_access_token", response.data.access_token, {
                maxAge: response.data.expires_in * 1000,
                ...COOKIE_OPTIONS,
            });
            res.status(200).json();
        }
    } else {
        res.status(401).json({ error: "invalid_api_key", message: "Invalid API Key" });
    }
};
