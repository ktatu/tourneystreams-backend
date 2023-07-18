import { TwitchUser } from "../types"

declare global {
    namespace Express {
        interface User {
            twitchToken?: string
            twitchUser?: TwitchUser
        }
    }
}

// https://stackoverflow.com/questions/60981735/passport-express-typescript-req-user-email-undefined
export {}
