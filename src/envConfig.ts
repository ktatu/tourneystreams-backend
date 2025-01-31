import "dotenv/config"

export const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID as string
export const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET as string
export const TWITCH_CALLBACK_URL = process.env.TWITCH_CALLBACK_URL as string

export const JWT_SECRET = process.env.JWT_SECRET as string
export const NODE_ENV = process.env.NODE_ENV

export const REDIS_URL = process.env.REDIS_URL as string
export const REDIS_USERNAME = process.env.REDIS_USERNAME as string
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD as string
export const REDIS_HOST = process.env.REDIS_HOST as string
export const REDIS_PORT = parseInt(process.env.REDIS_PORT as string)

export const CLIENT_URL =
    process.env.ENV === "production"
        ? (process.env.CLIENT_URL_PROD as string)
        : (process.env.CLIENT_URL_DEV as string)

if (!(TWITCH_CLIENT_ID && TWITCH_CLIENT_SECRET && TWITCH_CALLBACK_URL && JWT_SECRET)) {
    console.error("All env variables have not been set, process exiting")
    process.exit(1)
}
