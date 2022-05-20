import { getIgdbAccessToken } from "../igdb/igdbAccessToken.js";

const COOKIE_OPTIONS = {
    httpOnly: true,
};

export const setAccessCookies = (res, igdbAccessToken) => {
    res.cookie("api_key", process.env.API_KEY, {
        maxAge: igdbAccessToken.expires_in * 1000,
        ...COOKIE_OPTIONS,
    });
};

export const postAccess = async (context, req, res) => {
    if (req.body.apiKey === process.env.API_KEY) {
        const igdbAccessToken = await getIgdbAccessToken();
        setAccessCookies(res, igdbAccessToken);

        res.status(200).json();
    } else {
        res.status(401).json({ error: "invalid_api_key", message: "Invalid API Key" });
    }
};
