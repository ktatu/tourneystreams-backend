import jwt from "jsonwebtoken"
import { Entity, Repository, Schema } from "redis-om"
import { JWT_SECRET } from "../envConfig.js"
import redisClient from "../services/redisClient.js"
import { parseString } from "../utils/parseHelpers.js"
import validateError from "../utils/validateError.js"
import TwitchApi from "./twitch.api.js"

const twitchUserSchema = new Schema("twitchUser", {
    accessToken: { type: "string" },
    refreshToken: { type: "string" },
    userId: { type: "string" },
})

const getTwitchUserSchemaFields = () => twitchUserSchema.fields.map((field) => field.name)

const repository = new Repository(twitchUserSchema, redisClient)

class TwitchUser {
    accessToken: string
    refreshToken: string
    userId: string

    private constructor(accessToken: string, refreshToken: string, userId: string) {
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        this.userId = userId
    }

    public static get = async (
        userId: string,
        callback: (err: Error | null, twitchUser: TwitchUser | null) => void
    ) => {
        try {
            const entity = await repository.fetch(userId)

            if (this.incompleteOrMissingEntity(entity)) {
                callback(null, null)
            }

            const twitchUser = this.parseTwitchUserEntity(entity)

            callback(null, twitchUser)
        } catch (err) {
            const error = validateError(err)

            callback(error, null)
        }
    }

    public static save = async (accessToken: string, refreshToken: string, userId?: string) => {
        userId = userId || (await TwitchApi.getUserId(accessToken))

        await repository.save(userId, {
            accessToken,
            refreshToken,
            userId,
        })

        this.setEntityExpiration(userId)

        return userId
    }

    public static remove = async (userId: string) => {
        await repository.remove(userId)
    }

    public static createToken = (userId: string) => {
        return jwt.sign({ userId }, JWT_SECRET)
    }

    private static incompleteOrMissingEntity = (fetchedEntity: Entity) => {
        const expectedFields = getTwitchUserSchemaFields()

        for (const schemaField of expectedFields) {
            if (!fetchedEntity[schemaField]) {
                return true
            }
        }

        return false
    }

    private static setEntityExpiration = (userId: string) => {
        repository.expire(userId, 2629800) // 1 month
    }

    private static parseTwitchUserEntity = (entity: Entity) => {
        const twitchUser = new TwitchUser(
            parseString(entity.accessToken, "accessToken"),
            parseString(entity.refreshToken, "refreshToken"),
            parseString(entity.userId, "userId")
        )

        return twitchUser
    }
}

export default TwitchUser
