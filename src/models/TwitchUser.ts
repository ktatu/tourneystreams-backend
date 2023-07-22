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

    public static CreateTwitchUser = async (accessToken: string, refreshToken: string) => {
        const userId = await getUserId(accessToken)

        const savedUser = await repository.save({
            accessToken,
            refreshToken,
            userId,
        })

        const entityId = savedUser[EntityId]

        this.setUserExpiration(entityId)

        return entityId
    }

    public static GetTwitchUser = async (entityId: string) => {
        const savedUser = await repository.fetch("123")
        const test123 = savedUser[EntityId]

        this.validateFetchedEntity(savedUser, getTwitchUserSchemaFields())

        return parseTwitchUser(savedUser)
    }

    private static validateFetchedEntity = (
        fetchedEntity: Entity,
        expectedFields: Array<string>
    ) => {
        const missingKeyErrorString = "Twitch user entity missing key: "

        if (!fetchedEntity[EntityId]) {
            throw new Error(`${missingKeyErrorString} entityId`)
        }

        const test2 = fetchedEntity[EntityId]

        expectedFields.forEach((field) => {
            if (!(field in fetchedEntity)) {
                console.error(`${missingKeyErrorString} ${field}`)
                throw new Error("Missing or incomplete entity in database")
            }
        })

        return fetchedEntity
    }

    private static setUserExpiration = async (entityId: string | undefined) => {
        if (!entityId) {
            throw new Error("Saved user missing entity id")
        }

        await repository.expire(entityId, 2629800)
    }
}

export default TwitchUser
