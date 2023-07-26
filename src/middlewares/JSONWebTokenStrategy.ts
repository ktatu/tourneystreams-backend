import passport from "passport"
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt"
import { JWT_SECRET } from "../envConfig"
import TwitchUser from "../models/TwitchUser"

const strategyOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
}

passport.use(
    "twitchUser",
    new Strategy(strategyOptions, async (payload, done) => {
        await TwitchUser.Get(payload.userId, (error, twitchUser) => {
            if (error) {
                return done(error, false)
            }

            if (twitchUser) {
                const profile: Express.User = { twitchUser: twitchUser }
                return done(null, profile)
            }

            return done(null, false)
        })
    })
)

/*
passport.use(
    "twitchUserId",
    new Strategy(strategyOptions, (payload, done) => {
        const profile: Express.User = { twitchUserProfile: payload.userId }

        return done(null, profile)
    })
)
*/

export default {}
