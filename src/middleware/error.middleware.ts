import {NextFunction, Response, Request} from "express";
import HttpException from "../exceptions/HttpException";

function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
    const status = error.status || 500;
    const message = error.message || "Something went wrong";

    // import logger into middleware to log errors

    response
        .status(status)
        .send({
            status,
            message
        })
}

export default errorMiddleware;
