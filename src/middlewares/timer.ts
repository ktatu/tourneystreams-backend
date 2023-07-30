import { RequestHandler } from "express"

// Used for logging approximately how much time handling a request takes
// place the timer as the first middleware of the request handler
// put console.timeEnd("timer") at the end of the request handler

const timer: RequestHandler = (_req, _res, next) => {
    console.time("timer")
    next()
}

export default timer
