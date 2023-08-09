import { RequestHandler } from "express"
import TwitchApi from "../external_apis/TwitchApi"
import { AxiosError } from "axios"
import createHttpError from "http-errors"
import TwitchUser from "../models/TwitchUser"
import validateError from "../utils/validateError"

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
}

export default TwitchController
