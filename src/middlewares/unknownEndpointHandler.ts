import { RequestHandler } from "express"

const unknownEndpointHandler: RequestHandler = (_req, res, _next) => {
    return res.status(404).json({ message: "Unknown endpoint" })
}

export default unknownEndpointHandler
