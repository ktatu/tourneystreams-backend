import axios, { AxiosError } from "axios"
import { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } from "../envConfig"

/*
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
)*/

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
        throw new Error("Unexpected response data format")
    }

    return res.data.data as Array<unknown>
}

// https://dev.twitch.tv/docs/authentication/refresh-tokens/
const getRefreshedToken = async (refreshToken: string) => {
    /*
    console.log("GET REFRESHED TOKEN")
    try {
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

        console.log("res data ", res.data)

        return { newAccessToken: res.data.access_token, newRefreshToken: res.data.refresh_token }
    } catch (error) {
        console.log("get refreshed token error ", error)
    }
    console.log("123")
    return null*/
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

    console.log("res data ", res.data)

    return { newAccessToken: res.data.access_token, newRefreshToken: res.data.refresh_token }
}

// https://dev.twitch.tv/docs/api/reference/#get-users
const getUserId = async (accessToken: string) => {
    const res = await axios.get("https://api.twitch.tv/helix/users", {
        headers: { Authorization: `Bearer ${accessToken}`, "Client-ID": TWITCH_CLIENT_ID },
    })

    const userId = res.data.data[0].id

    if (!userId || typeof userId !== "string") {
        console.log("throwing error in get user id")
        throw new Error("Failed to retrieve user id from twitch")
    }

    console.log("user id ", userId)
    return userId
}

export { getFollowed, getRefreshedToken, getUserId }
