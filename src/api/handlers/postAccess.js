import { getIgdbAccessToken } from "../igdb/getIgdbAccessToken.js";

const COOKIE_OPTIONS = {
    httpOnly: true,
};

export const setAccessCookies = (res, igdbAccessToken) => {
    res.cookie("api_key", process.env.API_KEY, {
        maxAge: igdbAccessToken.expires_in * 1000,
        ...COOKIE_OPTIONS,
    });

    res.cookie("igdb_access_token", igdbAccessToken.access_token, {
        maxAge: igdbAccessToken.expires_in * 1000,
        ...COOKIE_OPTIONS,
    });
};

export const postAccess = async (context, req, res) => {
    if (req.body.apiKey === process.env.API_KEY) {
        let igdbAccessToken;
        try {
            igdbAccessToken = await getIgdbAccessToken();
        } catch (error) {
            res.status(error.response.data.status).json({
                error: "external_request",
                message: error.response.data.message,
            });
        }

        if (igdbAccessToken) {
            setAccessCookies(res, igdbAccessToken);
            res.status(200).json();
        }
    } else {
        res.status(401).json({ error: "invalid_api_key", message: "Invalid API Key" });
    }
};
