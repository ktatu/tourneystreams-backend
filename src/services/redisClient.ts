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

redisClient
    .connect()
    .then(() => {
        console.log("Connected to redis")
    })
    .catch((error: unknown) => {
        console.error("Error connecting redis: ", error)
        process.exit(1)
    })

export default redisClient
