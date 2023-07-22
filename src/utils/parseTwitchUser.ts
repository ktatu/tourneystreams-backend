import { Entity, EntityId } from "redis-om"
import { TwitchUser } from "../types/types"
import { parseString } from "./parseHelpers"

const parseTwitchUser = (twitchUserEntity: Entity) => {
    // validated here because typescript considers it string | undefined if validated beforehand
    if (!twitchUserEntity[EntityId]) {
        throw new Error("No entity id")
    }

    const parsedTwitchUser: TwitchUser = {
        accessToken: parseString(twitchUserEntity.accessToken, "accessToken"),
        entityId: twitchUserEntity[EntityId],
        refreshToken: parseString(twitchUserEntity.refreshToken, "refreshToken"),
        userId: parseString(twitchUserEntity.userId, "userId"),
    }

    return parsedTwitchUser
}

export default parseTwitchUser
