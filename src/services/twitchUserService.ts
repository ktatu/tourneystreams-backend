import twitchUserSchema from "../models/twitchUser"
import { Repository, EntityId, Entity } from "redis-om"
import redisClient from "./redisClient"
import twitchUserRepository from "../models/twitchUser"

const createTwitchUser = async (user: Entity) => {
    const savedUser = await twitchUserRepository.save({ ...user })

    return savedUser
}
