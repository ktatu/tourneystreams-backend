import { Request } from "express"
import passport from "passport"
import { Strategy, StrategyOptions } from "passport-jwt"
import { JWT_SECRET } from "../envConfig.js"
import TwitchUser from "../twitch/twitch.user.js"

const extractJwtFromCookie = (req: Request) => {
    const jwt = req.cookies?.["twitch-token"] || null
    if (jwt === null) {
        console.log("jwt is null")
    }
    return jwt
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
                console.log("twitch-user strat error ", error.message)
                return done(error)
            }

            if (twitchUser) {
                console.log("twitch-user strat was twitch user")
                const profile: Express.User = { twitchUser }
                return done(null, profile)
            }

            return done(null, false)
        })
    }),
)

export default {}
