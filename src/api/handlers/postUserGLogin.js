import { getGLoginPayload } from "../library/getGLoginPayload.js";
import { nanoid } from "nanoid";
import { upsertUser } from "../datastore/upsertUser.js";
import { upsertGameList } from "../datastore/upsertGameList.js";
import { getUsersByEmailAddress } from "../datastore/getUser.js";

const COOKIE_OPTIONS = {
    httpOnly: true,
};

export const postUserGLogin = async (context, req, res) => {
    const payload = await getGLoginPayload(req.body.credential);
    const users = await getUsersByEmailAddress(payload.email);

    let userData;

    if (users.length > 0) {
        userData = { ...users[0], ...userData };

        if (users[0].auth_key_expires_at < new Date()) {
            userData.auth_key = nanoid(32);
            userData.auth_key_expires_at = getExpiryDate();
        }
    } else {
        userData = {
            ...userData,
            id: nanoid(),
            auth_key: nanoid(32),
            auth_key_expires_at: getExpiryDate(),
            google_id: payload["sub"],
            email_address: payload["email"],
        };

        await upsertGameList(userData.id, [], "default");
    }

    await upsertUser(userData);

    res.cookie("auth_key", userData.auth_key, {
        expires: getExpiryDate(),
        ...COOKIE_OPTIONS,
    });

    // eslint-disable-next-line no-unused-vars
    const { auth_key, ...publicUserData } = userData;
    res.status(200).json(publicUserData);
};

function getExpiryDate() {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    return expiryDate;
}
