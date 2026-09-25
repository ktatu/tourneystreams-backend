import axios from "axios"
import { YOUTUBE_API_KEY } from "../envConfig.js"

class YoutubeApi {
    static async getChannelName(videoId: string) {
        const response = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
            params: {
                part: "snippet",
                id: videoId,
                key: YOUTUBE_API_KEY,
            },
        })

        const item = response.data.items[0]
        if (!item) {
            throw new Error(`No video found for id ${videoId}`)
        }

        console.log("youtube api")

        return item.snippet.channelTitle
    }
}

export default YoutubeApi
