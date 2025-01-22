import type { Request, Response } from "express";

export const pingController = async (_: Request, res: Response) => {
  res.status(200).json({
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
};
