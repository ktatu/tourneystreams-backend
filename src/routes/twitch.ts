import express from "express"
import passport from "passport"
import { CLIENT_URL } from "../envConfig"
import { format } from "url"

const router = express.Router()

// haetaan seuratut kanavat
router.get("/", (req, res) => {
    console.log("req query ", req.query)
    res.status(200).send("ok")
})

//router.get("/auth", passport.authenticate("twitch", { scope: "user:read:follows", session: false }))

router.get("/auth", (req, res) => {
    const authenticator = passport.authenticate("twitch", {
        scope: "user:read:follows",
        session: false,
        state: JSON.stringify(req.query),
    })

    authenticator(req, res)
})

router.get(
    "/redirect",
    passport.authenticate("twitch", { failureRedirect: "http://localhost:3000", session: false }),
    (req, res) => {
        if (!req.user) {
            return res.status(500)
        }

        const { state } = req.query
        const urlString = format({ pathname: CLIENT_URL, query: JSON.parse(state as string) })

        res.cookie("twitch-token", req.user.twitchToken)

        return res.redirect(urlString)
    }
)

export default router
