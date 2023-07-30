import { ErrorRequestHandler } from "express"
import prettyError from "../utils/prettyError"

const errorHandler: ErrorRequestHandler = (error, _req, _res, next) => {
    console.log(prettyError.render(error))
    next(error)
}

export default errorHandler
