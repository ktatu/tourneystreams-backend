export interface TwitchUser {
    accessToken: string
    entityId: string
    refreshToken: string
    userId: string
}

export interface FollowedStream {
    category: string
    title: string
    loginName: string
    broadcastName: string
    viewerCount: number
}
