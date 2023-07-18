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
import twitchRepository from "../models/twitchUser"
import { EntityId } from "redis-om"

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
            let userId
            let entityId: string

            try {
                userId = await getUserId(accessToken)

                if (!userId) {
                    return done(null, false)
                }

                const newUser = await twitchRepository.save({
                    accessToken,
                    refreshToken,
                    userId,
                })

                if (!newUser[EntityId]) {
                    throw new Error("Entity id missing")
                }

                entityId = newUser[EntityId]

                await twitchRepository.expire(entityId, 2629800) // 1 month
            } catch (error: unknown) {
                console.error("OAuth2Strategy error: ", error)
                return done(error)
            }

            const token = jwt.sign({ entityId }, JWT_SECRET)

            profile.twitchToken = token

            return done(null, profile)
        }
    )
)

export default OAuth2Strategy
