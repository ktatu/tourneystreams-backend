import axios, { AxiosError } from "axios"
import { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } from "../envConfig"

/*
type TwitchApiError = {
    statusCode: number
    message?: string
}*/

axios.interceptors.response.use(
    (res) => {
        return res
    },
    (error: unknown) => {
        if (error instanceof AxiosError) {
            console.error("AxiosError in response intercepted")
            console.error("Error status: ", error.response?.status)
            console.error("Error data: ", error.response?.data)
        } else {
            console.error("Unknown error in response intercepted")
            console.error("Error: ", error)
        }

        return Promise.reject(error)
    }
)

/*
const getFollowed = async (accessToken: string, userId: string) => {
    try {
        const res = await axios.get("https://api.twitch.tv/helix/streams/followed", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Client-Id": TWITCH_CLIENT_ID,
            },
            params: { user_id: userId, first: 100 },
        })

        return res.data

        
        const followedStreams: Array<FollowedStream> = twitchRes.data.data.map(
            (dataEntry: unknown) => parseFollowedStream(dataEntry)
        )
    } catch (error: unknown) {
        console.error(error)
        if (error instanceof AxiosError && error.response?.data.message === "Invalid OAuth token") {
            return { error: "Invalid token" }
        }
        return { error: "Unknown error" }
    }
}*/

// https://dev.twitch.tv/docs/api/reference/#get-followed-channels
const getFollowed = async (accessToken: string, userId: string) => {
    const res = await axios.get("https://api.twitch.tv/helix/streams/followed", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Client-Id": TWITCH_CLIENT_ID,
        },
        params: { user_id: userId, first: 100 },
    })

    if (!(res.data.data instanceof Array)) {
        throw new Error("Unexpected result data format")
    }

    return res.data.data as Array<unknown>
}

/*
const getRefreshedToken = async (refreshToken: string) => {
    try {
        const twitchRes = await axios.post(
            "https://id.twitch.tv/oauth2/token",
            {
                client_id: TWITCH_CLIENT_ID,
                client_secret: TWITCH_CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            },
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )

        //const { access_token, refresh_token } = twitchRes.data
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error("axios error: status: ", error.response?.status)
            console.error("axios error: data: ", error.response?.data)
        } else {
            console.error("unknown error: ", error)
        }
    }
}*/

const getRefreshedToken = async (refreshToken: string) => {
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

    //const { access_token, refresh_token } = twitchRes.data
    return { newAccessToken: res.data.access_token, newRefreshToken: res.data.refresh_token }
}

export { getFollowed, getRefreshedToken }
