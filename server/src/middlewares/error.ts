import type { ErrorRequestHandler } from "express";

import { HTTP_STATUS } from "../utils/http";

export const errorMiddleware: ErrorRequestHandler = (error, _, res, __) => {
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: error.message,
  });
};
