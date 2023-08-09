import express from "express"
import passport from "passport"
import { CLIENT_URL } from "../envConfig"
import { format as formatUrl } from "url"
import createHttpError from "http-errors"
import TwitchController from "../controllers/TwitchController"

const router = express.Router()

router.get(
    "/",
    passport.authenticate("twitch-user", { session: false }),
    TwitchController.getFollowedStreams
)

router.get("/auth", (req, res, next) => {
    const authenticator = passport.authenticate("twitch-auth", {
        scope: "user:read:follows",
        session: false,
        state: JSON.stringify(req.query),
    })

    authenticator(req, res, next)
})

router.get(
    "/redirect",
    passport.authenticate("twitch-auth", { failureRedirect: CLIENT_URL, session: false }),
    (req, res, next) => {
        if (!req.user?.twitchToken) {
            return next(createHttpError(500, "Unexpected error"))
        }

        const { state } = req.query
        const urlString = formatUrl({ pathname: CLIENT_URL, query: JSON.parse(state as string) })

        res.cookie("twitch-token", req.user.twitchToken)

        return res.redirect(urlString)
    }
)

export default router
