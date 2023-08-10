import axios from "axios"
import { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } from "../envConfig"
import parseFollowedStreams from "../utils/parseFollowedStreams"

class TwitchApi {
    // https://dev.twitch.tv/docs/api/reference/#get-followed-channels
    static async getFollowedStreams(accessToken: string, userId: string) {
        const res = await axios.get("https://api.twitch.tv/helix/streams/followed", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Client-Id": TWITCH_CLIENT_ID,
            },
            params: { user_id: userId, first: 100 },
        })

        if (!(res.data.data instanceof Array)) {
            throw new Error("Unexpected response data format")
        }

        const parsedData = parseFollowedStreams(res.data.data)

        return parsedData
    }

    // https://dev.twitch.tv/docs/authentication/refresh-tokens/
    static async getRefreshedToken(refreshToken: string) {
        const res = await axios.post(
            "https://id.twitch.tv/oauth2/token",
            {
                client_id: TWITCH_CLIENT_ID,
                client_secret: TWITCH_CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            },
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )

        return { newAccessToken: res.data.access_token, newRefreshToken: res.data.refresh_token }
    }

    // https://dev.twitch.tv/docs/api/reference/#get-users
    static async getUserId(accessToken: string) {
        const res = await axios.get("https://api.twitch.tv/helix/users", {
            headers: { Authorization: `Bearer ${accessToken}`, "Client-ID": TWITCH_CLIENT_ID },
        })

        const userId = res.data.data[0].id

        if (!userId || typeof userId !== "string") {
            throw new Error("Failed to retrieve user id from twitch")
        }

        return userId
    }
}

export default TwitchApi
