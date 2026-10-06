// Claude Sonnet 5.5 (AI) added the OAuth state generation and verification (authenticate, verifyState, authRedirect).
import { randomBytes, timingSafeEqual } from "crypto"
import { RequestHandler } from "express"
import createHttpError from "http-errors"
import passport from "passport"
import { format as formatUrl } from "url"
import { CLIENT_URL } from "../envConfig.js"
import { parseGetStreamsQueryParams } from "../utils/parseGetStreamsParams.js"
import { userDataExpirationTime } from "../utils/userDataExpiration.js"
import validateError from "../utils/validateError.js"
import TwitchService from "./twitch.service.js"

const STATE_COOKIE = "twitch-oauth-state"

class TwitchController {
    static getFollowedStreams: RequestHandler = async (req, res, next) => {
        console.log("request")
        if (!req.user?.twitchUser) {
            return next(createHttpError(500, "Unexpected error"))
        }

        try {
            const followedStreams = await TwitchService.getFollowedStreams(req.user.twitchUser)
            console.log("followed streams ")
            return res.json({ streams: followedStreams })
        } catch (err: unknown) {
            const error = validateError(err)
            console.error("error in getFollowedStreams ", error.message)
            return res.status(500).end()
        }
    }

    static getStreams: RequestHandler<
        Record<string, never>,
        unknown,
        unknown,
        { params: { channels: string[] } }
    > = async (req, res, next) => {
        if (!req.user?.twitchUser) {
            return next(createHttpError(500, "Unexpected error"))
        }

        try {
            console.log(req.query.params.channels)
            const parsedChannels: Array<string> = parseGetStreamsQueryParams(
                req.query.params.channels,
            )
            const streams = await TwitchService.getStreams(req.user.twitchUser, parsedChannels)
            return res.json({ streams })
        } catch (err: unknown) {
            const error = validateError(err)
            console.error("error in getStreams ", error.message)
            return res.status(500).end()
        }
    }

    static authenticate: RequestHandler = async (req, res, next) => {
        const state = randomBytes(32).toString("hex")

        res.cookie(STATE_COOKIE, state, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 300000, // 5 minutes
        })

        passport.authenticate("twitch-auth", {
            scope: "user:read:follows",
            session: false,
            state,
        })(req, res, next)
    }

    static verifyState: RequestHandler = (req, res, next) => {
        const expected: unknown = req.cookies?.[STATE_COOKIE]
        const received: unknown = req.query.state
        res.clearCookie(STATE_COOKIE)

        if (typeof expected !== "string" || typeof received !== "string") {
            return next(createHttpError(400, "Invalid state"))
        }

        const a = new Uint8Array(Buffer.from(expected))
        const b = new Uint8Array(Buffer.from(received))
        if (a.length !== b.length || !timingSafeEqual(a, b)) {
            return next(createHttpError(400, "Invalid state"))
        }

        return next()
    }

    static authRedirect: RequestHandler = async (req, res, next) => {
        if (!req.user?.twitchToken) {
            return next(createHttpError(500, "Unexpected error"))
        }

        const urlString = formatUrl({ pathname: CLIENT_URL })

        res.cookie("twitch-token", req.user.twitchToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: userDataExpirationTime("ms"),
        })

        return res.redirect(urlString)
    }
}

export default TwitchController
