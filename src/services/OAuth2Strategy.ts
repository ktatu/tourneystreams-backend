import passport, { DoneCallback } from "passport"
import { Strategy } from "passport-oauth2"
import jwt from "jsonwebtoken"
import {
    TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET,
    TWITCH_CALLBACK_URL,
    JWT_SECRET,
} from "../envConfig"
import { getUserId } from "../external_requests/twitch"

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
        async (
            accessToken: string,
            refreshToken: string,
            profile: Express.User,
            done: DoneCallback
        ) => {
            const userId = await getUserId(accessToken)

            const jwtToken = jwt.sign({ accessToken, refreshToken, userId }, JWT_SECRET)
            profile.twitchJWTToken = jwtToken

            done(null, profile)
        }
    )
)

export default OAuth2Strategy
