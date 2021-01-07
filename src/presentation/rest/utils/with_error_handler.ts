import { Request, Response, NextFunction } from "express"
import StatusCodes from "http-status-codes"

type RequestHandler = (
  request: Request,
  response: Response,
  next?: NextFunction
) => unknown

export const withErrorHandler = (handler: RequestHandler) => async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    return await handler(request, response, next)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error) // send logs to cloud service instead?
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
  }
}
