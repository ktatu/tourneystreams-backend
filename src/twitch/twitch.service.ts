import TwitchApi from "./twitch.api.js"
import TwitchUser from "./twitch.user.js"

class TwitchService {
    static async getFollowedStreams(user: TwitchUser) {
        const followedStreams = await TwitchApi.getFollowedStreams(user)
        const loginNames = followedStreams.map((stream) => stream.loginName)

        const profileImageUrls = await TwitchApi.getProfileImageUrls(user.accessToken, loginNames)
        const streamsWithProfileImageUrls = followedStreams.map((stream) => {
            return { ...stream, profileImageUrl: profileImageUrls.get(stream.loginName) }
        })

        return streamsWithProfileImageUrls
    }
}

export default TwitchService
