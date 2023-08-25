import { createClient } from "redis"
import { NODE_ENV, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } from "../envConfig.js"

const redisClient =
    NODE_ENV === "production"
        ? createClient({
              password: REDIS_PASSWORD,
              socket: {
                  host: REDIS_HOST,
                  port: REDIS_PORT,
              },
          })
        : createClient()

redisClient.on("error", (err) => console.log("Redis Client Error", err))
redisClient.on("connect", () => console.log("Connected to redis"))

await redisClient.connect()

export default redisClient
