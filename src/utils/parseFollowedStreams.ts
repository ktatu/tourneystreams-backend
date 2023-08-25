import { FollowedStream } from "../types/types.js"
import { parseString, parseNumber } from "./parseHelpers.js"

const parseFollowedStreams = (rawDataArray: Array<unknown>) => {
    const parsedArray: Array<FollowedStream> = []

    rawDataArray.forEach((dataObj) => {
        try {
            const followedStream = parseRawData(dataObj)
            parsedArray.push(followedStream)
        } catch (error: unknown) {
            console.error("Error parsing followed streams")
            console.error(error)
        }
    })

    return parsedArray
}

const parseRawData = (rawData: unknown) => {
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
        category: parseString(rawData.game_name, "game"),
        title: parseString(rawData.title, "title"),
        loginName: parseString(rawData.user_login, "loginName"),
        broadcastName: parseString(rawData.user_name, "broadcastName"),
        viewerCount: parseNumber(rawData.viewer_count, "viewerCount"),
    }

    return followedStream
}

export default parseFollowedStreams
