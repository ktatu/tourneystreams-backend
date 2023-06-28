import passport, { DoneCallback } from "passport"
import { Strategy } from "passport-oauth2"
import jwt from "jsonwebtoken"
import {
    TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET,
    TWITCH_CALLBACK_URL,
    JWT_SECRET,
} from "../envConfig"

const OAuth2Strategy = passport.use(
    "twitch",
    new Strategy(
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

export default OAuth2Strategy
