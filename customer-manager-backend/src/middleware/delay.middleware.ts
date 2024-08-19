import { Request, Response, NextFunction } from 'express';

export function delay(req: Request, res: Response, next: NextFunction) {
  setTimeout(() => next(), Number(process.env.DELAY_TIMEOUT) || 0);
}
