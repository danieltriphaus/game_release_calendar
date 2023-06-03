import passport from "passport";
import GoogleStrategy from "passport-google-oidc";
import session from "express-session";
import { getUsersByGoogleId } from "../datastore/getUser.js";
import { upsertUser } from "../datastore/upsertUser.js";
import { upsertGameList } from "../datastore/upsertGameList.js";
import { nanoid } from "nanoid";
import { Datastore } from "@google-cloud/datastore";
import { DatastoreStore } from "@google-cloud/connect-datastore";
import { logError } from "../library/writeLog.js";

/**
 * @param {import('express').Express} app
 */
export const initPassport = (app) => {
    initStrategy();

    initSession(app);

    initRoutes(app);
};

/**
 * @param {import('express').Express} app
 */
function initRoutes(app) {
    app.get("/login/google", passport.authenticate("google"));
    app.get("/oauth2/redirect", passport.authenticate("google", { failureRedirect: "/", failureMessage: true }), (req, res) => {
        if (process.env.NODE_ENV === "production") {
            res.redirect("/");
        } else {
            res.redirect("http://localhost:8080");
        }
    });
}


/**
 * @param {import('express').Express} app
 */
function initSession(app) {
    app.use(session(
        {
            secret: process.env["SESSION_SECRET"],
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
            },
            store: new DatastoreStore({
                dataset: new Datastore(),
                kind: "express-sessions",
            }),
        },
    ));

    app.use(passport.authenticate("session"));

    passport.serializeUser(function (user, cb) {
        process.nextTick(function () {
            cb(null, { id: user.id, email: user.email_address, google_id: user.google_id });
        });
    });

    passport.deserializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user);
        });
    });
}

function initStrategy() {
    passport.use(new GoogleStrategy(
        {
            clientID: process.env["GOOGLE_CLIENT_ID"],
            clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
            callbackURL: process.env.NODE_ENV === "development" ? "http://localhost:3000/oauth2/redirect" : process.env.APP_URL + "/oauth2/redirect",
        },
        async function verify(issuer, profile, cb) {
            try {
                const users = await getUsersByGoogleId(profile.id);

                if (users && users.length >= 1) {
                    return cb(null, users[0]);
                } else {
                    const userData = {
                        id: nanoid(),
                        google_id: profile.id,
                    };

                    await upsertUser(userData);
                    await upsertGameList(userData.id, [], "default");

                    return cb(null, userData);
                }
            } catch (error) {
                logError(error);
                return cb(error);
            }
        },
    ));
}



