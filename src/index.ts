import "./middlewares/OAuth2Strategy"
import "./middlewares/JSONWebTokenStrategy"
import errorHandler from "./middlewares/errorHandler"
import unknownEndpointHandler from "./middlewares/unknownEndpointHandler"
import express from "express"
const app = express()

import "express-async-errors"
import cors from "cors"
import twitchRouter from "./twitch/twitch.router"

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
