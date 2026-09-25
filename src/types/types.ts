import "axios"
import TwitchUser from "../twitch/twitch.user.js"

declare module "axios" {
    interface AxiosRequestConfig {
        twitchTokenRefreshAttempted?: boolean
        twitchUser?: TwitchUser
    }
}

export interface FollowedStream {
    category: string
    title: string
    loginName: string
    broadcastName: string
    viewerCount: number
    profileImageUrl?: string
}

export interface Stream {
    loginName: string
    broadcastName: string
    viewerCount: number
}
