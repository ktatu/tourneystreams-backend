import express from "express"
import passport from "passport"
import { CLIENT_URL, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, JWT_SECRET } from "../envConfig"
import { format } from "url"
import axios, { AxiosError } from "axios"
import parseFollowedStream from "../utils/parseFollowedStream"
import { FollowedStream } from "../types"
import jwt from "jsonwebtoken"
import { getFollowed, getRefreshedToken } from "../requests/twitch"
//import TwitchService from "../services/TwitchService"

const router = express.Router()

/*
router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const twitchRes = await axios.get("https://api.twitch.tv/helix/streams/followed", {
            headers: {
                Authorization: `Bearer ${req.user?.accessToken}`,
                "Client-Id": TWITCH_CLIENT_ID,
            },
            params: { user_id: req.user?.userId, first: 100 },
        })

        const followedStreams: Array<FollowedStream> = twitchRes.data.data.map(
            (dataEntry: unknown) => parseFollowedStream(dataEntry)
        )

        return res.json(followedStreams)
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            if (error.response?.data.message === "Invalid OAuth token") {
                console.log("invalid token, request new one")
                try {
                    const twitchRes = await axios.post(
                        "https://id.twitch.tv/oauth2/token",
                        {
                            client_id: TWITCH_CLIENT_ID,
                            client_secret: TWITCH_CLIENT_SECRET,
                            grant_type: "refresh_token",
                            refresh_token: req.user?.refreshToken,
                        },
                        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
                    )

                    console.log("twitchRes ", twitchRes)
                    const { access_token, refresh_token } = twitchRes.data
                    const jwtToken = jwt.sign(
                        {
                            accessToken: access_token,
                            refreshToken: refresh_token,
                            userId: req.user?.userId,
                        },
                        JWT_SECRET
                    )
                    console.log("jwt token ", jwtToken)
                    res.cookie("twitch-token", jwtToken)
                    return res.status(401).json({ newToken: jwtToken })
                } catch (error: unknown) {
                    if (error instanceof AxiosError) {
                        console.error("axios error: status: ", error.response?.status)
                        console.error("axios error: data: ", error.response?.data)
                    } else {
                        console.error("unknown error: ", error)
                    }

                    return res.status(500).end()
                }
            }
        } else {
            console.error("unknown error: ", error)
        }

        return res.status(500).end()
    }
})*/

router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    // TODO: better way of handling this. In OAuth2Strategy?
    if (!req.user) {
        return res.status(500).end()
    }
    try {
        const twitchResData = await getFollowed(req.user.accessToken, req.user.userId)
        const followedStreams: Array<FollowedStream> = twitchResData.map((dataEntry: unknown) =>
            parseFollowedStream(dataEntry)
        )
        console.log("returning followed streams")
        return res.json({ streams: followedStreams })
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
                try {
                    const { newAccessToken, newRefreshToken } = await getRefreshedToken(
                        req.user.refreshToken
                    )

                    const twitchResData = await getFollowed(newAccessToken, req.user?.userId)
                    const followedStreams: Array<FollowedStream> = twitchResData.map(
                        (dataEntry: unknown) => parseFollowedStream(dataEntry)
                    )
                    const newJwtToken = jwt.sign(
                        {
                            accessToken: newAccessToken,
                            refreshToken: newRefreshToken,
                            userId: req.user.userId,
                        },
                        JWT_SECRET
                    )

                    console.log("old twitch token ", req.user.twitchJWTToken)
                    console.log("new twitch token ", newJwtToken)

                    res.clearCookie("twitch-token")
                    res.cookie("twitch-token", newJwtToken)
                    console.log("data retrieved with refreshed token")
                    return res.json({ streams: followedStreams, newToken: newJwtToken })
                } catch (error: unknown) {
                    console.log("failed to retrieve data with refreshed token")
                    return res.status(500).end()
                }
            }
        }

        return res.status(500).end()
    }
})

router.get("/newfollowed", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const twitchRes = await axios.get("https://api.twitch.tv/helix/streams/followed", {
            headers: {
                Authorization: `Bearer ${req.user?.accessToken}`,
                "Client-Id": TWITCH_CLIENT_ID,
            },
            params: { user_id: req.user?.userId, first: 100 },
        })

        const followedStreams: Array<FollowedStream> = twitchRes.data.data.map(
            (dataEntry: unknown) => parseFollowedStream(dataEntry)
        )

        return res.json(followedStreams)
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            if (error.response?.data.message === "Invalid OAuth token") {
                console.log("invalid token, request new one")
                try {
                    const twitchRes = await axios.post(
                        "https://id.twitch.tv/oauth2/token",
                        {
                            client_id: TWITCH_CLIENT_ID,
                            client_secret: TWITCH_CLIENT_SECRET,
                            grant_type: "refresh_token",
                            refresh_token: req.user?.refreshToken,
                        },
                        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
                    )

                    console.log("twitchRes ", twitchRes)
                    const { access_token, refresh_token } = twitchRes.data
                    const jwtToken = jwt.sign(
                        {
                            accessToken: access_token,
                            refreshToken: refresh_token,
                            userId: req.user?.userId,
                        },
                        JWT_SECRET
                    )
                    console.log("jwt token ", jwtToken)
                    res.cookie("twitch-token", jwtToken)
                    return res.status(401).json({ newToken: jwtToken })
                } catch (error: unknown) {
                    if (error instanceof AxiosError) {
                        console.error("axios error: status: ", error.response?.status)
                        console.error("axios error: data: ", error.response?.data)
                    } else {
                        console.error("unknown error: ", error)
                    }

                    return res.status(500).end()
                }
            }
        } else {
            console.error("unknown error: ", error)
        }

        return res.status(500).end()
    }
})

router.get("/refresh", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const twitchRes = await axios.post(
            "https://id.twitch.tv/oauth2/token",
            {
                client_id: TWITCH_CLIENT_ID,
                client_secret: TWITCH_CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: req.user?.refreshToken,
            },
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        console.log("twitch res ", twitchRes)

        const { access_token, refresh_token } = twitchRes.data
        const jwtToken = jwt.sign(
            { accessToken: access_token, refreshToken: refresh_token, userId: req.user?.userId },
            JWT_SECRET
        )
        res.cookie("twitch-token", jwtToken)
        return res.status(twitchRes.status).end()
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error("axios error: status: ", error.response?.status)
            console.error("axios error: data: ", error.response?.data)
        } else {
            console.error("unknown error: ", error)
        }

        return res.status(500).end()
    }
})

router.get("/auth", (req, res, next) => {
    const authenticator = passport.authenticate("twitch", {
        scope: "user:read:follows",
        session: false,
        state: JSON.stringify(req.query),
    })

    authenticator(req, res, next)
})

router.delete("/auth", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const twitchRes = await axios.post(
        "https://id.twitch.tv/oauth2/revoke",
        { client_id: TWITCH_CLIENT_ID, token: req.user?.accessToken },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )
    console.log("twitch res ", twitchRes)

    res.status(twitchRes.status).end()
})

router.get(
    "/redirect",
    passport.authenticate("twitch", { failureRedirect: CLIENT_URL, session: false }),
    (req, res) => {
        if (!req.user) {
            return res.status(500)
        }

        const { state } = req.query
        const urlString = format({ pathname: CLIENT_URL, query: JSON.parse(state as string) })

        res.cookie("twitch-token", req.user.twitchJWTToken)

        return res.redirect(urlString)
    }
)

export default router
