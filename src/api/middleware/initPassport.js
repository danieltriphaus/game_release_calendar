import passport from "passport";
import GoogleStrategy from "passport-google-oidc";
import session from "express-session";
import { getUsersByGoogleId } from "../datastore/getUser.js";
import { upsertUser } from "../datastore/upsertUser.js";
import { nanoid } from "nanoid";
import { Datastore } from "@google-cloud/datastore";
import { DatastoreStore } from "@google-cloud/connect-datastore";

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
            console.log(user);
            return cb(null, user);
        });
    });
}

function initStrategy() {
    passport.use(new GoogleStrategy(
        {
            clientID: process.env["GOOGLE_CLIENT_ID"],
            clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
            callbackURL: "http://localhost:3000/oauth2/redirect",
        },
        async function verify(issuer, profile, cb) {
            const users = await getUsersByGoogleId(profile.id);

            if (users.length >= 1) {
                // The account at Google has previously logged in to the app.  Get the
                // user record associated with the Google account and log the user in.
                return cb(null, users[0]);
            } else {
                // The account at Google has not logged in to this app before.  Create a
                // new user record and associate it with the Google account.
                const userData = {
                    id: nanoid(),
                    google_id: profile.id,
                };

                upsertUser(userData);
                return cb(null, userData);
            }
        },
    ));
}
