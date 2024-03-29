import express from "express"
import errorHandler from "./middlewares/errorHandler.js"
import unknownEndpointHandler from "./middlewares/unknownEndpointHandler.js"

import "./middlewares/JSONWebTokenStrategy.js"
import "./middlewares/OAuth2Strategy.js"

const app = express()

import cors from "cors"
import "express-async-errors"
import twitchRouter from "./twitch/twitch.router.js"

app.use(cors())
app.use(express.json())

app.use(express.static("build"))

app.use("/api/twitch", twitchRouter)

app.get("/api/healthcheck", (req, res) => {
    return res.status(200).send("ok")
})

app.use(unknownEndpointHandler)
app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log("server running on port ", PORT)
})
