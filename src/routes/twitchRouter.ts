import express from "express"
import passport from "passport"
import { CLIENT_URL } from "../envConfig"
import { format as formatUrl } from "url"
import axios, { AxiosError } from "axios"
import parseFollowedStreams from "../utils/parseFollowedStreams"
import jwt from "jsonwebtoken"
import { getFollowed, getRefreshedToken } from "../external_requests/twitchRequests"
import TwitchUserEntity from "../models/TwitchUserEntity"
//import TwitchService from "../services/TwitchService"

const router = express.Router()

router.get(
    "/",
    passport.authenticate("jwt", {
        session: false,
    }),
    async (req, res) => {
        if (!req.user?.twitchUser) {
            return res.status(500).end()
        }

        const { accessToken, entityId, refreshToken, userId } = req.user.twitchUser

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
                        await TwitchUserEntity.save(entityId, {
                            ...req.user.twitchUser,
                            accessToken: newAccessToken,
                            refreshToken: newRefreshToken,
                        })

                        return res.json({ streams: followedStreams })
                    } catch (error: unknown) {
                        console.log("failed to retrieve data with refreshed token")
                        return res.status(500).end()
                    }
                }
            }
            return res.status(500).end()
        }
    }
)

router.get("/auth", (req, res, next) => {
    const authenticator = passport.authenticate("twitch", {
        scope: "user:read:follows",
        session: false,
        state: JSON.stringify(req.query),
    })

    authenticator(req, res, next)
})

router.get(
    "/redirect",
    passport.authenticate("twitch", { failureRedirect: CLIENT_URL, session: false }),
    (req, res) => {
        if (!req.user) {
            return res.status(500)
        }

        const { state } = req.query
        const urlString = formatUrl({ pathname: CLIENT_URL, query: JSON.parse(state as string) })

        res.cookie("twitch-token", req.user.twitchToken)

        return res.redirect(urlString)
    }
)

router.get("/errortest", () => {
    console.log("error test endpoint")
    throw new Error("Error test")
})

router.get("/ping", (req, res) => {
    console.log("pong")
    res.send("pong")
})

export default router
