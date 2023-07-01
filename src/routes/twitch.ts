import express from "express"
import passport from "passport"
import { CLIENT_URL, TWITCH_CLIENT_ID } from "../envConfig"
import { format } from "url"
import axios from "axios"
import parseFollowedStream from "../utils/parseFollowedStream"
import { FollowedStream } from "../types"

const router = express.Router()

router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const twitchRes = await axios.get("https://api.twitch.tv/helix/streams/followed", {
            headers: {
                Authorization: `Bearer ${req.user?.accessToken}`,
                "Client-Id": TWITCH_CLIENT_ID,
            },
            params: { user_id: req.user?.userId, first: 100 },
        })

        const followedStreams: Array<FollowedStream> = twitchRes.data.data.map(
            (dataEntry: unknown) => parseFollowedStream(dataEntry)
        )

        return res.json(followedStreams)
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message)
        } else {
            console.error("Unable to retrieve and parse followed streams data")
        }

        return res.status(500).end()
    }
})

router.get("/auth", (req, res, next) => {
    const authenticator = passport.authenticate("twitch", {
        scope: "user:read:follows",
        session: false,
        state: JSON.stringify(req.query),
    })

    authenticator(req, res, next)
})

router.delete("/auth", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const twitchRes = await axios.post(
        "https://id.twitch.tv/oauth2/revoke",
        { client_id: TWITCH_CLIENT_ID, token: req.user?.accessToken },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )
    console.log("twitch res ", twitchRes)

    res.status(twitchRes.status).end()
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
