import passport from "passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { JWT_SECRET } from "../envConfig"
import TwitchUser from "../models/TwitchUser"

passport.use(
    "jwt",
    new Strategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET,
        },
        async (jwtPayload, done) => {
            try {
                const twitchUser = await TwitchUser.GetTwitchUser(jwtPayload.entityId)
                const profile: Express.User = { twitchUser }

                return done(null, profile)
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error(error.message)

                    if (error.message === "Missing or incomplete entity in database") {
                        return done(null, false)
                    }
                }
                return done(error)
            }
        }
    )
)

export default {}
