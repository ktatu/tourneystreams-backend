import { RequestHandler } from "express"
import TwitchApi from "./twitch.api.js"
import { AxiosError } from "axios"
import createHttpError from "http-errors"
import TwitchUser from "./twitch.user.js"
import validateError from "../utils/validateError.js"
import passport from "passport"
import { format as formatUrl } from "url"
import { CLIENT_URL } from "../envConfig.js"

class TwitchController {
    static getFollowedStreams: RequestHandler = async (req, res, next) => {
        if (!req.user?.twitchUser) {
            return next(createHttpError(500, "Unexpected error"))
        }

        const { accessToken, refreshToken, userId } = req.user.twitchUser

        try {
            const followedStreams = await TwitchApi.getFollowedStreams(accessToken, userId)

            if (followedStreams.length === 0) {
                return res.sendStatus(204)
            }

            return res.json({ streams: followedStreams })
        } catch (err: unknown) {
            const error = validateError(err)

            if (error instanceof AxiosError && error.response?.status === 401) {
                const { newAccessToken, newRefreshToken } = await TwitchApi.getRefreshedToken(
                    refreshToken
                )
                const followedStreams = await TwitchApi.getFollowedStreams(newAccessToken, userId)

                await TwitchUser.Save(newAccessToken, newRefreshToken, userId)

                return res.json({ streams: followedStreams })
            }
            return res.status(500).end()
        }
    }

    static authenticate: RequestHandler = async (req, res, next) => {
        passport.authenticate("twitch-auth", {
            scope: "user:read:follows",
            session: false,
            state: JSON.stringify(req.query),
        })(req, res, next)
    }

    static authRedirect: RequestHandler = async (req, res, next) => {
        if (!req.user?.twitchToken) {
            return next(createHttpError(500, "Unexpected error"))
        }

        const { state } = req.query
        const urlString = formatUrl({ pathname: CLIENT_URL, query: JSON.parse(state as string) })

        res.cookie("twitch-token", req.user.twitchToken)

        return res.redirect(urlString)
    }
}

export default TwitchController
