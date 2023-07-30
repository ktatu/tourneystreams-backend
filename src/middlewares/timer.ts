import { RequestHandler } from "express"

// Used for logging approximately how much time handling a request takes
// place the timer has the first middleware of a request handler
// put console.timeEnd("timer") at the end of the request handler

const timer: RequestHandler = (_req, _res, next) => {
    console.time("timer")
    next()
}

export default timer
