import { createClient } from "redis"
import { REDIS_URL } from "../envConfig"

let redisClient = createClient({ url: REDIS_URL })

redisClient.on("error", (error) => console.error("redis client error ", error))

const redisConnect = async () => {
    await redisClient.connect()
}

redisConnect()

export default redisClient
