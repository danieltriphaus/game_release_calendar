import express from "express";
import cookieParser from "cookie-parser";
import { apiBackend } from "./middleware/apiBackend.js";
import multer from "multer";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { xss } from "express-xss-sanitizer";
import { getIgdbAccessToken } from "./igdb/igdbAccessToken.js";

import { fileURLToPath } from "url";
import { dirname } from "path";

import { initPassport } from "./middleware/initPassport.js";
import cors from "cors";

dotenv.config();

const app = express();
const router = express.Router();

if (process.env.NODE_ENV === "development") {
    router.use(cors());
}
app.use(cookieParser());

router.use(express.json());
router.use(cookieParser());
router.use(multer().any());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(xss());

initPassport(app);

router.use(apiBackend());
app.use("/api", router);

if (process.env.NODE_ENV === "production") {
    app.all(/.*/, function (req, res, next) {
        var host = req.header("host");
        if (host.match(/^www\..*/i)) {
            next();
        } else {
            res.redirect(301, req.protocol + "://www." + host);
        }
    });

    app.get("/app/*.js", function (req, res, next) {
        req.url = req.url + ".gz";
        res.set("Content-Encoding", "gzip");
        res.set("Content-Type", "text/javascript");
        next();
    });
    app.get("/app/*.css", function (req, res, next) {
        req.url = req.url + ".gz";
        res.set("Content-Encoding", "gzip");
        res.set("Content-Type", "text/css");
        next();
    });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    app.use("/events", express.static(__dirname + "/dist/events/", { etag: false, lastModified: false }));
    app.use("/app", express.static(__dirname + "/dist/frontend/", { etag: false, lastModified: false }));
    app.use("/landingpage", express.static(__dirname + "/dist/landingpage", { etag: false, lastModified: false }));

    app.get("/", (req, res) => {
        if (req.user) {
            res.redirect("/app");
        } else {
            res.sendFile(__dirname	+ "/dist/landingpage/index.html");
        }
    });
}

let port = process.env.PORT;

if (process.env.NODE_ENV === "development") {
    port = 3000;
}



const listener = app.listen(port, async () => {
    await getIgdbAccessToken();
    console.log("Listening on port " + listener.address().port);
});
