import axios, { AxiosError } from "axios"
import { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } from "../envConfig.js"
import parseFollowedStreams from "../utils/parseFollowedStreams.js"
import parseProfileImageUrls from "../utils/parseProfileImageUrls.js"
import validateError from "../utils/validateError.js"
import TwitchUser from "./twitch.user.js"

const twitchAxios = axios.create()

// refresh access token when twitch returns 401 and resend request -- expired access token is the most likely cause of the failed request
twitchAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (
            error instanceof AxiosError &&
            error.config &&
            error.response?.status === 401 &&
            !error.config.twitchTokenRefreshAttempted &&
            error.config.twitchUser
        ) {
            const { userId, refreshToken } = error.config.twitchUser
            const { newAccessToken, newRefreshToken } =
                await TwitchApi.getRefreshedToken(refreshToken)

            await TwitchUser.save(newAccessToken, newRefreshToken, userId)

            error.config.twitchUser.accessToken = newAccessToken
            error.config.twitchTokenRefreshAttempted = true
            error.config.headers.Authorization = `Bearer ${newAccessToken}`

            return twitchAxios(error.config)
        } else {
            const err = validateError(error)
            console.error("Error in intercepted twitch response ", err.message)
            throw err
        }
    },
)

class TwitchApi {
    // https://dev.twitch.tv/docs/api/reference/#get-followed-streams
    static async getFollowedStreams(user: TwitchUser) {
        const res = await twitchAxios.get("https://api.twitch.tv/helix/streams/followed", {
            headers: {
                Authorization: `Bearer ${user.accessToken}`,
                "Client-Id": TWITCH_CLIENT_ID,
            },
            params: { user_id: user.userId, first: 100 },
            twitchUser: user,
        })

        const parsedStreams = parseFollowedStreams(res.data.data)
        return parsedStreams
    }

    // https://dev.twitch.tv/docs/api/reference#get-users
    static async getProfileImageUrls(accessToken: string, loginNames: Array<string>) {
        const res = await twitchAxios.get("https://api.twitch.tv/helix/users", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Client-Id": TWITCH_CLIENT_ID,
            },
            params: { login: loginNames },
            paramsSerializer: { indexes: null },
        })

        const profileImageUrls: Map<string, string> = parseProfileImageUrls(res.data.data)
        return profileImageUrls
    }

    // https://dev.twitch.tv/docs/authentication/refresh-tokens/
    static async getRefreshedToken(refreshToken: string) {
        const res = await twitchAxios.post(
            "https://id.twitch.tv/oauth2/token",
            {
                client_id: TWITCH_CLIENT_ID,
                client_secret: TWITCH_CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            },
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
        )

        return { newAccessToken: res.data.access_token, newRefreshToken: res.data.refresh_token }
    }

    // https://dev.twitch.tv/docs/api/reference/#get-users
    static async getUserId(accessToken: string) {
        const res = await twitchAxios.get("https://api.twitch.tv/helix/users", {
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
