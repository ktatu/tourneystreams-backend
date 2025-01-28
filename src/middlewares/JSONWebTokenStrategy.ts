import passport from "passport"
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt"
import { JWT_SECRET } from "../envConfig.js"
import TwitchUser from "../twitch/twitch.user.js"

const strategyOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
    })
)

export default {}
