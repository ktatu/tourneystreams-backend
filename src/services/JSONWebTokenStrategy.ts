import passport from "passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { JWT_SECRET } from "../envConfig"
import TwitchUserEntity from "../models/TwitchUserEntity"
import parseTwitchUser from "../utils/parseTwitchUser"

const JWTStrategy = passport.use(
    "jwt",
    new Strategy(
        { jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: JWT_SECRET },
        async (jwtPayload, done) => {
            try {
                const twitchUserEntity = await TwitchUserEntity.fetch(jwtPayload.entityId)
                const twitchUser = parseTwitchUser(twitchUserEntity)
                const profile: Express.User = { twitchUser }

                return done(null, profile)
            } catch (error: unknown) {
                console.log("jwt strat error: ", error)
                return done(null, false)
            }
        }
    )
)

export default JWTStrategy
