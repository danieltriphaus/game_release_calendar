import express from "express";
import cookieParser from "cookie-parser";
import { apiBackend } from "./middleware/apiBackend.js";
import multer from "multer";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { getIgdbAccessToken } from "./igdb/igdbAccessToken.js";

import historyApiFallback from "connect-history-api-fallback";

import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const app = express();
const router = express.Router();

router.use(express.json());
router.use(cookieParser());
router.use(multer().any());
router.use(bodyParser.urlencoded({ extended: true }));

router.use(apiBackend());

app.use("/api", router);

if (process.env.NODE_ENV === "production") {
    app.use(historyApiFallback());
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    app.use(express.static(__dirname + "/views/", { etag: false, lastModified: false }));
}

let port = process.env.PORT;

if (process.env.NODE_ENV === "development") {
    port = 3000;
}

await getIgdbAccessToken();

const listener = app.listen(port, async () => {
    console.log("Listening on port " + listener.address().port);
});
