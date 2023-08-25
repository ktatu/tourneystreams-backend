import express from "express"
import passport from "passport"
import TwitchController from "./twitch.controller.js"

const router = express.Router()

router.get(
    "/",
    passport.authenticate("twitch-user", { session: false }),
    TwitchController.getFollowedStreams
)

router.get("/auth", TwitchController.authenticate)

router.get("/redirect", passport.authenticate("twitch-auth", { session: false }))

export default router
