import { getGLoginPayload } from "../library/getGLoginPayload.js";
import { nanoid } from "nanoid";
import { upsertUser } from "../datastore/upsertUser.js";
import { upsertGameList } from "../datastore/upsertGameList.js";
import { getUsersByEmailAddress } from "../datastore/getUser.js";

const COOKIE_OPTIONS = {
    httpOnly: true,
};

export const postUserGLogin = async (context, req, res) => {
    let userData;

    const payload = await getGLoginPayload(req.body.credential);

    const users = await getUsersByEmailAddress(payload.email);

    if (users.length > 0) {
        userData = users[0];
    } else {
        userData = {
            id: nanoid(),
            google_id: payload["sub"],
            email_address: payload["email"],
            auth_key: nanoid(32),
        };

        try {
            await upsertUser(userData);
            await upsertGameList(userData.id, [], "default");
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    }

    res.cookie("auth_key", userData.auth_key, {
        maxAge: 5260000 * 1000,
        ...COOKIE_OPTIONS,
    });

    // eslint-disable-next-line no-unused-vars
    const { auth_key, ...publicUserData } = userData;
    res.status(200).json(publicUserData);
};
