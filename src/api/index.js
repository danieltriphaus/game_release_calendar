import express from "express";
import cookieParser from "cookie-parser";
import { apiBackend } from "./middleware/apiBackend.js";
import multer from "multer";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(multer().any());

app.use(apiBackend());

const listener = app.listen(3000, () => {
    console.log("Listening on port " + listener.address().port);
});
