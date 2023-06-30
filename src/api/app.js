import express from "express";
import cookieParser from "cookie-parser";
import { apiBackend } from "./middleware/apiBackend.js";
import multer from "multer";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { xss } from "express-xss-sanitizer";
import { getIgdbAccessToken } from "./igdb/igdbAccessToken.js";

import historyApiFallback from "connect-history-api-fallback";

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

router.use(express.json());
router.use(cookieParser());
router.use(multer().any());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(xss());



initPassport(app);

router.use(apiBackend());
app.use("/api", router);

if (process.env.NODE_ENV === "production") {
    app.use(historyApiFallback({ verbose: true, rewrites: [
        {
            from: /\/events/, to: (context) => {
                if (context.parsedUrl.pathname === "/events/") {
                    return "/events/index.html";
                } else if (context.parsedUrl.pathname.endsWith("/")) {
                    return context.parsedUrl.pathname.slice(0, -1);
                } else {
                    return context.parsedUrl.pathname;
                }
            },
        },
    ] }));
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    app.use("/events", express.static(__dirname + "/dist/events/", { etag: false, lastModified: false }));
    app.use(express.static(__dirname + "/dist/frontend/", { etag: false, lastModified: false }));
}



let port = process.env.PORT;

if (process.env.NODE_ENV === "development") {
    port = 3000;
}

const listener = app.listen(port, async () => {
    await getIgdbAccessToken();
    console.log("Listening on port " + listener.address().port);
});
