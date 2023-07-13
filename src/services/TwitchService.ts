/*import { getFollowed, getRefreshedToken } from "../external_requests/twitch"
import { FollowedStream } from "../types"
import parseRawData from "../utils/parseFollowedStreams"


const TwitchService = () => {
    const getFollowedStreams = async (accessToken: string, userId: string) => {
        try {
            const twitchResData = await getFollowed(accessToken, userId)
            const followedStreams: Array<FollowedStream> = twitchResData.map((dataEntry: unknown) =>
                parseRawData(dataEntry)
            )
        } catch (error: unknown) {
            console.log("error")
        }
    }
}*/

export default {} //TwitchService
