import { OAuth2Client } from "google-auth-library";

export const getGLoginPayload = async (credential) => {
    const client = new OAuth2Client(process.env.VITE_GOOGLE_SIGN_IN_APP_ID);
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.VITE_GOOGLE_SIGN_IN_APP_ID,
    });

    const payload = ticket.getPayload();
    return payload;
};
