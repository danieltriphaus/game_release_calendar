import express from "express";
import cookieParser from "cookie-parser";
import OpenAPIBackend from "openapi-backend";
import multer from "multer";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(multer().any());

const api = new OpenAPIBackend.default({
    definition: "src/api/schema/GameReleaseCalendar.json",
    handlers: {
        "post-access": async (c, req, res) => {
            res.status(200).json({ operationId: c.operation.operationId });
        },
    },
});

api.init();

app.use((req, res) => api.handleRequest(req, req, res));

const listener = app.listen(3000, () => {
    console.log("Listening on port " + listener.address().port);
});
