import passport from "passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { JWT_SECRET } from "../envConfig"

const JWTStrategy = passport.use(
    "jwt",
    new Strategy(
        { jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: JWT_SECRET },
        (jwt_payload, done) => {
            return done(null, jwt_payload)
        }
    )
)

export default JWTStrategy
