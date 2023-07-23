import { EntityId, Repository, Schema, Entity } from "redis-om"
import redisClient from "../services/redisClient"
import { getUserId } from "../external_requests/twitchRequests"
import parseTwitchUser from "../utils/parseTwitchUser"

const twitchUserSchema = new Schema("twitchUser", {
    accessToken: { type: "string" },
    refreshToken: { type: "string" },
    userId: { type: "string" },
})

const getTwitchUserSchemaFields = () => twitchUserSchema.fields.map((field) => field.name)

const repository = new Repository(twitchUserSchema, redisClient)

class TwitchUser {
    private constructor() {}

    public static SaveTwitchUser = async (
        accessToken: string,
        refreshToken: string,
        userId?: string
    ) => {
        userId = userId || (await getUserId(accessToken))

        await repository.save(userId, {
            accessToken,
            refreshToken,
            userId,
        })

        this.setUserExpiration(userId)

        return userId
    }

    public static GetTwitchUser = async (userId: string) => {
        const savedUser = await repository.fetch(userId)

        this.validateFetchedEntity(savedUser, getTwitchUserSchemaFields())

        return parseTwitchUser(savedUser)
    }

    private static validateFetchedEntity = (
        fetchedEntity: Entity,
        expectedFields: Array<string>
    ) => {
        const missingKeyErrorString = "Twitch user entity missing key: "

        expectedFields.forEach((field) => {
            if (!(field in fetchedEntity)) {
                console.error(`${missingKeyErrorString} ${field}`)
                throw new Error("Missing or incomplete entity in database")
            }
        })

        return fetchedEntity
    }

    private static setUserExpiration = async (userId: string | undefined) => {
        if (!userId) {
            throw new Error("Saved user missing entity id")
        }

        await repository.expire(userId, 2629800) // 1 month
    }
}

export default TwitchUser
