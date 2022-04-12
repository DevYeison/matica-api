"use strict";

const express = require("express");
require("express-async-errors");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");

const { PORT } = require("./src/config");
const { NotFoundMiddleware, ErrorMiddleware, Controller } = require("./src");

const app = express();
const router = express.Router();

router
    .use(cors())
    .use(helmet())
    .use(express.json())
    .use(compression());

router.get("/", Controller.get);
router.use(NotFoundMiddleware);
router.use(ErrorMiddleware);

app.use(router);

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let interval;

io.on("connection", (socket) => {
    console.log("New client connected");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    });
});

const getApiAndEmit = socket => {
    const date = new Date();
    const localeSpecificTime = date.toLocaleTimeString();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", localeSpecificTime);
};
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));