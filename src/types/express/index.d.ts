import TwitchUser from "../../twitch/twitch.user.js"

/* 
Anything that gets passed from passport middleware to request handlers
needs to be added to User interface
*/

declare global {
    namespace Express {
        interface User {
            twitchUser?: TwitchUser
            twitchUserId?: string
            twitchToken?: string
        }
    }
}

// https://stackoverflow.com/questions/60981735/passport-express-typescript-req-user-email-undefined
export {}
