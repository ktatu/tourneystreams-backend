import { Repository, Entity, Schema } from "redis-om"
import redisClient from "../services/redisClient"

const twitchUserSchema = new Schema("twitchUser", {
    accessToken: { type: "string" },
    refreshToken: { type: "string" },
    userId: { type: "string" },
})

const repository = new Repository(twitchUserSchema, redisClient)

export default repository
