import express from "express"
import passport from "passport"
import { CLIENT_URL, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, JWT_SECRET } from "../envConfig"
import { format } from "url"
import axios, { AxiosError } from "axios"
import parseFollowedStreams from "../utils/parseFollowedStreams"
import jwt from "jsonwebtoken"
import { getFollowed, getRefreshedToken } from "../external_requests/twitch"
//import TwitchService from "../services/TwitchService"

const router = express.Router()

router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    // TODO: better way of handling this. In OAuth2Strategy?
    // return res.status(200).send("ok")

    if (!req.user?.twitchUser) {
        return res.status(500).end()
    }

    const { accessToken, refreshToken, userId } = req.user.twitchUser

    try {
        const twitchResData = await getFollowed(accessToken, userId)
        const followedStreams = parseFollowedStreams(twitchResData)
        //console.log(twitchResData)
        return res.json({ streams: followedStreams })
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
                try {
                    const { newAccessToken, newRefreshToken } = await getRefreshedToken(
                        refreshToken
                    )

                    const twitchResData = await getFollowed(newAccessToken, userId)
                    const followedStreams = parseFollowedStreams(twitchResData)
                    const newJwtToken = jwt.sign(
                        {
                            accessToken: newAccessToken,
                            refreshToken: newRefreshToken,
                            userId,
                        },
                        JWT_SECRET
                    )

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

        console.error("unknown error: ", error)
        return res.status(500).end()
    }
})

/*
router.get("/refresh", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { }

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
    return res.status(200).send("ok")
})*/

router.get("/auth", (req, res, next) => {
    const authenticator = passport.authenticate("twitch", {
        scope: "user:read:follows",
        session: false,
        state: JSON.stringify(req.query),
    })

    authenticator(req, res, next)
})

router.delete("/auth", passport.authenticate("jwt", { session: false }), async (req, res) => {
    /*
    const twitchRes = await axios.post(
        "https://id.twitch.tv/oauth2/revoke",
        { client_id: TWITCH_CLIENT_ID, token: req.user?.accessToken },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )
    console.log("twitch res ", twitchRes)

    res.status(twitchRes.status).end()
    */
    return res.status(200).send("ok")
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

        res.cookie("twitch-token", req.user.twitchToken)

        return res.redirect(urlString)
    }
)

export default router
