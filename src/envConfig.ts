require("dotenv").config()

export const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID as string
export const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET as string
export const TWITCH_CALLBACK_URL = process.env.TWITCH_CALLBACK_URL as string

export const JWT_SECRET = process.env.JWT_SECRET as string
export const REDIS_URL = process.env.REDIS_URL
export const NODE_ENV = process.env.NODE_ENV

export const CLIENT_URL =
    process.env.NODE_ENV === "production"
        ? (process.env.CLIENT_URL_PROD as string)
        : (process.env.CLIENT_URL_DEV as string)

if (!(TWITCH_CLIENT_ID && TWITCH_CLIENT_SECRET && TWITCH_CALLBACK_URL && JWT_SECRET)) {
    console.error("All env variables have not been set, process exiting")
    process.exit(1)
}
