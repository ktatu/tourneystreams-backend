import { RequestHandler } from "express"
import createHttpError from "http-errors"
import passport from "passport"
import { format as formatUrl } from "url"
import { CLIENT_URL } from "../envConfig.js"
import validateError from "../utils/validateError.js"
import TwitchService from "./twitch.service.js"

class TwitchController {
    static getFollowedStreams: RequestHandler = async (req, res, next) => {
        if (!req.user?.twitchUser) {
            return next(createHttpError(500, "Unexpected error"))
        }

        try {
            const followedStreams = await TwitchService.getFollowedStreams(req.user.twitchUser)
            return res.json({ streams: followedStreams })
        } catch (err: unknown) {
            const error = validateError(err)
            console.error("error in getFollowedStreams ", error.message)
            return res.status(500).end()
        }
    }

    /*
    static getStreams: RequestHandler = async (req, res, next) => {
        if (!req.user?.twitchUser) {
            return next(createHttpError(500, "Unexpected error"))
        }

        try {
            const streams = await TwitchService.getStreams(req.user.twitchUser)
        } catch (err: unknown) {
            const error = validateError(err)
            console.error("error in getStreams ", error.message)
        }
    }
    */

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

        res.cookie("twitch-token", req.user.twitchToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 864000,
        })

        return res.redirect(urlString)
    }
}

export default TwitchController
