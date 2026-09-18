import express from "express"
import YoutubeApi from "./youtube.api.js"

const router = express.Router()

router.get("/channelname/:videoId", async (req, res) => {
    try {
        const channelName = await YoutubeApi.getChannelName(req.params.videoId)
        return res.json({ channel: channelName })
    } catch (error: unknown) {
        if (error instanceof Error && error.message.startsWith("No video found")) {
            return res.status(404).end()
        }

        return res.status(500).end()
    }
})

export default router
