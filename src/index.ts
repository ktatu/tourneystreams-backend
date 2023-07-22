import "./services/OAuth2Strategy"
import "./services/JSONWebTokenStrategy"

import express from "express"
const app = express()

import "express-async-errors"
import cors from "cors"
import twitchRouter from "./routes/twitchRouter"
import errorHandler from "./errorHandler"

app.use(cors())
app.use(express.json())

app.use("/api/twitch", twitchRouter)

app.use((_req, res, _next) => {
    res.status(404).send({ message: "Not found" })
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log("server running on port ", PORT)
})
