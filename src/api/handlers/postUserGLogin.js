import { OAuth2Client } from "google-auth-library";
import { nanoid } from "nanoid";
import { upsertUser } from "../datastore/upsertUser.js";
import { getUsersByEmailAddress } from "../datastore/getUser.js";
import { getIgdbAccessToken } from "../igdb/getIgdbAccessToken.js";
import { setAccessCookies } from "./postAccess.js";

export const postUserGLogin = async (context, req, res) => {
    let userData;

    const client = new OAuth2Client(process.env.VUE_APP_GOOGLE_SIGN_IN_APP_ID);
    const ticket = await client.verifyIdToken({
        idToken: req.body.credential,
        audience: process.env.VUE_APP_GOOGLE_SIGN_IN_APP_ID,
    });

    const payload = ticket.getPayload();

    const users = await getUsersByEmailAddress(payload.email);

    if (users.length > 0) {
        userData = users[0];
    } else {
        userData = {
            id: nanoid(),
            google_id: payload["sub"],
            email_address: payload["email"],
        };

        try {
            await upsertUser(userData);
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    }

    const igdbAccessToken = await getIgdbAccessToken();
    setAccessCookies(res, igdbAccessToken);
    res.status(200).json(userData);
};
