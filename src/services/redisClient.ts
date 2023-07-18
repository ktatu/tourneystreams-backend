import { createClient } from "redis"

const redisClient = createClient()

redisClient.on("error", (error) => console.error(error))

const redisConnect = async () => {
    await redisClient.connect()
}

redisConnect()

export default redisClient
