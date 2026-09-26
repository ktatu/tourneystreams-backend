import { Request } from "express"
import passport from "passport"
import { Strategy, StrategyOptions } from "passport-jwt"
import { JWT_SECRET } from "../envConfig.js"
import TwitchUser from "../twitch/twitch.user.js"

const extractJwtFromCookie = (req: Request) => {
    return req.cookies?.["twitch-token"] || null
}

const strategyOptions: StrategyOptions = {
    jwtFromRequest: extractJwtFromCookie,
    secretOrKey: JWT_SECRET,
}

passport.use(
    "twitch-user",
    new Strategy(strategyOptions, async (payload, done) => {
        await TwitchUser.get(payload.userId, (error, twitchUser) => {
            if (error) {
                return done(error)
            }

            if (twitchUser) {
                const profile: Express.User = { twitchUser }
                return done(null, profile)
            }

            return done(null, false)
        })
    }),
)

export default {}
