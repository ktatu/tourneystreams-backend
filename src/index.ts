import express from "express"

import passport, { DoneCallback } from "passport"
import jwt from "jsonwebtoken"
import cors from "cors"
import {
    TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET,
    TWITCH_CALLBACK_URL,
    JWT_SECRET,
} from "./envConfig"
import { Strategy as OAuth2Strategy } from "passport-oauth2"
import twitchRouter from "./routes/twitch"

const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/twitch", twitchRouter)

passport.use(
    "twitch",
    new OAuth2Strategy(
        {
            authorizationURL: "https://id.twitch.tv/oauth2/authorize",
            tokenURL: "https://id.twitch.tv/oauth2/token",
            clientID: TWITCH_CLIENT_ID,
            clientSecret: TWITCH_CLIENT_SECRET,
            callbackURL: TWITCH_CALLBACK_URL,
        },
        (accessToken: string, refreshToken: string, profile: Express.User, done: DoneCallback) => {
            const jwtToken = jwt.sign({ accessToken, refreshToken }, JWT_SECRET)
            profile.twitchToken = jwtToken

            done(null, profile)
        }
    )
)

app.get("/api", (_req, res) => {
    res.send("test")
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log("server running on port ", PORT)
})
