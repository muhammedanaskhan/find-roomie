import { Request, Response, NextFunction, RequestHandler } from 'express';

const AsyncHandler = (requestHandler: RequestHandler) => {
    return (req: Request, res: Response ,next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err))
    }
}

export {AsyncHandler}