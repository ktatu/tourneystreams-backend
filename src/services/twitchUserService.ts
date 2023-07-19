import twitchUserSchema from "../models/TwitchUserEntity"
import { Repository, EntityId, Entity } from "redis-om"
import redisClient from "./redisClient"
import twitchUserRepository from "../models/TwitchUserEntity"

const createTwitchUser = async (user: Entity) => {
    const savedUser = await twitchUserRepository.save({ ...user })

    return savedUser
}
