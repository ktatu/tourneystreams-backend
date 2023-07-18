import { Entity } from "redis-om"
import { TwitchUser } from "../types/types"
import { parseString, parseNumber } from "./parseHelpers"

const parseTwitchUser = (twitchUserEntity: Entity) => {
    const missingKeyErrorString = "Twitch user entity missing key: "

    if (!("accessToken" in twitchUserEntity)) {
        throw new Error(`${missingKeyErrorString} accessToken`)
    }
    if (!("refreshToken" in twitchUserEntity)) {
        throw new Error(`${missingKeyErrorString} refreshToken`)
    }
    if (!("userId" in twitchUserEntity)) {
        throw new Error(`${missingKeyErrorString} userId`)
    }

    const parsedTwitchUser: TwitchUser = {
        accessToken: parseString(twitchUserEntity.accessToken, "accessToken"),
        refreshToken: parseString(twitchUserEntity.refreshToken, "refreshToken"),
        userId: parseString(twitchUserEntity.userId, "userId"),
    }

    return parsedTwitchUser
}

export default parseTwitchUser
