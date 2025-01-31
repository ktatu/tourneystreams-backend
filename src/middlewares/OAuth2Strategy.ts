import passport, { DoneCallback } from "passport"
import { Strategy } from "passport-oauth2"
import { TWITCH_CALLBACK_URL, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } from "../envConfig.js"
import TwitchUser from "../twitch/twitch.user.js"

const OAuth2Strategy = passport.use(
    "twitch-auth",
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
            _profile: Express.User,
            done: DoneCallback
        ) => {
            const userId = await TwitchUser.save(accessToken, refreshToken)

            if (!userId) {
                return done("error")
            }

            const token = TwitchUser.createToken(userId)

            const twitchUserProfile: Express.User = { twitchToken: token }
            return done(null, twitchUserProfile)
        }
    )
)

export default OAuth2Strategy
