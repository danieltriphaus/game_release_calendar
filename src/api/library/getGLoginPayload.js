import { OAuth2Client } from "google-auth-library";
/**
 * @module getGLoginPayload
 */

/**
 * @param {string} credential
 * @returns
 */
export const getGLoginPayload = async (credential) => {
    const client = new OAuth2Client(process.env.VITE_GOOGLE_SIGN_IN_APP_ID);
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.VITE_GOOGLE_SIGN_IN_APP_ID,
    });

    return ticket.getPayload();
};
