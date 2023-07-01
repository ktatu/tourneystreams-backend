import { FollowedStream } from "../types"

const parseFollowedStream = (rawData: unknown) => {
    if (!rawData || typeof rawData !== "object") {
        throw new Error("Data missing or raw data is not an object")
    }

    if (!("game_name" in rawData)) {
        throw new Error("Missing key: game_name")
    }
    if (!("title" in rawData)) {
        throw new Error("Missing key: title")
    }
    if (!("user_login" in rawData)) {
        throw new Error("Missing key: user_login")
    }
    if (!("user_name" in rawData)) {
        throw new Error("Missing key: user_name")
    }
    if (!("viewer_count" in rawData)) {
        throw new Error("Missing key: viewer_count")
    }

    const followedStream: FollowedStream = {
        game: parseString(rawData.game_name, "game"),
        title: parseString(rawData.title, "title"),
        loginName: parseString(rawData.user_login, "loginName"),
        broadcastName: parseString(rawData.user_name, "broadcastName"),
        viewerCount: parseNumber(rawData.viewer_count, "viewerCount"),
    }

    return followedStream
}

const parseString = (stringValue: unknown, key: string) => {
    if (typeof stringValue !== "string") {
        throw new Error(`Key ${key}: expected string, was ${typeof stringValue}`)
    }

    return stringValue
}

const parseNumber = (numValue: unknown, key: string) => {
    if (!numValue || typeof numValue !== "number") {
        throw new Error(`Key ${key}: expected number, was ${typeof numValue}`)
    }

    return numValue
}

export default parseFollowedStream
