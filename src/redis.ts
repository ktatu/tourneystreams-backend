import { createClient } from "redis"
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_URL, REDIS_USERNAME } from "./envConfig.js"

const redis = REDIS_URL
    ? createClient({ url: REDIS_URL })
    : createClient({
          username: REDIS_USERNAME,
          password: REDIS_PASSWORD,
          socket: {
              host: REDIS_HOST,
              port: REDIS_PORT,
          },
      })

export default redis
