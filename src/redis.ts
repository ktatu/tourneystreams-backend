import { createClient } from "redis"
import { REDIS_URL } from "./envConfig.js"

const redis = createClient({ url: REDIS_URL })

redis.on("error", (err) => console.log("Redis Client Error", err))
redis.on("connect", () => console.log("Connected to redis"))

await redis.connect()

export default redis
