import express from "express"
import passport from "passport"
import { CLIENT_URL } from "../envConfig"
import { format as formatUrl } from "url"
import { AxiosError } from "axios"
import parseFollowedStreams from "../utils/parseFollowedStreams"
import { getFollowed, getRefreshedToken } from "../external_requests/twitchRequests"
import TwitchUser from "../models/TwitchUser"
import validateError from "../utils/validateError"
import createHttpError from "http-errors"

const router = express.Router()

router.get(
    "/",
    passport.authenticate("jwt", {
        session: false,
    }),
    async (req, res, next) => {
        if (!req.user?.twitchUser) {
            return next(createHttpError(500, "Error test 123"))
        }

        const { accessToken, refreshToken, userId } = req.user.twitchUser

        try {
            const twitchResData = await getFollowed(accessToken, userId)
            const followedStreams = parseFollowedStreams(twitchResData)

            return res.json({ streams: followedStreams })
        } catch (err: unknown) {
            const error = validateError(err)

            if (error instanceof AxiosError && error.response?.status === 401) {
                try {
                    const { newAccessToken, newRefreshToken } = await getRefreshedToken(
                        refreshToken
                    )

                    const twitchResData = await getFollowed(newAccessToken, userId)
                    const followedStreams = parseFollowedStreams(twitchResData)

                    await TwitchUser.SaveTwitchUser(newAccessToken, newRefreshToken, userId)

                    return res.json({ streams: followedStreams })
                } catch (error: unknown) {
                    console.log("failed to retrieve data with refreshed token")
                    return res.status(500).end()
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

export default router
