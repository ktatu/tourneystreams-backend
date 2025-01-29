import express from "express"
import errorHandler from "./middlewares/errorHandler.js"
import unknownEndpointHandler from "./middlewares/unknownEndpointHandler.js"
import redis from "./redis.js"

import "./middlewares/JSONWebTokenStrategy.js"
import "./middlewares/OAuth2Strategy.js"

const app = express()

import cors from "cors"
import "express-async-errors"
import twitchRouter from "./twitch/twitch.router.js"

app.use(cors())
app.use(express.json())

app.use("/twitch", twitchRouter)

app.get("/healthcheck", (req, res) => {
    return res.status(200).send("ok")
})

app.use(unknownEndpointHandler)
app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, async () => {
    console.log("server running on port ", PORT)
    try {
        await redis.connect()
    } catch (error) {
        console.error("Error connecting to redis")
        console.error(error)
    }
})
