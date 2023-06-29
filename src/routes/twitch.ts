import express from "express"
import passport from "passport"
import { CLIENT_URL, TWITCH_CLIENT_ID } from "../envConfig"
import { format } from "url"
import axios from "axios"

const router = express.Router()

// haetaan seuratut kanavat
router.get("/", (req, res) => {
    console.log("req query ", req.query)
    res.status(200).send("ok")
})

router.get("/test", passport.authenticate("jwt", { session: false }), async (req, res) => {
    console.log("req user ", req.user)
    const twitchRes = await axios.get("https://api.twitch.tv/helix/streams/followed", {
        headers: {
            Authorization: `Bearer ${req.user?.accessToken}`,
            "Client-Id": TWITCH_CLIENT_ID,
        },
        params: { user_id: req.user?.userId, first: 100 },
    })

    console.log("twitch res data ", twitchRes.data)

    res.status(200).end()
})

//router.get("/auth", passport.authenticate("twitch", { scope: "user:read:follows", session: false }))

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
        const urlString = format({ pathname: CLIENT_URL, query: JSON.parse(state as string) })

        res.cookie("twitch-token", req.user.twitchJWTToken)

        return res.redirect(urlString)
    }
)

export default router
