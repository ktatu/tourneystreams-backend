import express from "express"
import passport from "passport"
import { CLIENT_URL } from "../envConfig"

const router = express.Router()

router.get("/auth", passport.authenticate("twitch", { scope: "user:read:follows", session: false }))

router.get(
    "/redirect",
    passport.authenticate("twitch", { failureRedirect: "/", session: false }),
    (req, res) => {
        if (!req.user) {
            return res.status(500)
        }

        //console.log("twitch token ", req.user.twitchToken)
        console.log("req query ", req.query)

        res.cookie("twitch-token", req.user.twitchToken)
        return res.redirect(CLIENT_URL)
    }
)

export default router
