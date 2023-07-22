import { ErrorRequestHandler } from "express"

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.log("-----------------------------")
    console.log("-----------------------------")
    console.log("error in error handler ", error)
    next(error)
}

export default errorHandler
