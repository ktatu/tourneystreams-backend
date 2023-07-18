import passport from "passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { JWT_SECRET } from "../envConfig"
import twitchRepository from "../models/twitchUser"
import parseTwitchUser from "../utils/parseTwitchUser"

const JWTStrategy = passport.use(
    "jwt",
    new Strategy(
        { jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: JWT_SECRET },
        async (jwtPayload, done) => {
            const twitchUserEntity = await twitchRepository.fetch(jwtPayload.entityId)

            try {
                const twitchUser = parseTwitchUser(twitchUserEntity)
                const profile: Express.User = { twitchUser }

                return done(null, profile)
            } catch (error: unknown) {
                return done(null, false)
            }
        }
    )
)

export default JWTStrategy
