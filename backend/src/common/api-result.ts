import { Response } from 'express';

/** The shape every endpoint returns internally: an HTTP status and a JSON body.
 *  Mirrors the original Lambda's `json(status, body)` so status codes are exact. */
export interface ApiResult {
  status: number;
  body: any;
}

export const result = (status: number, body: any): ApiResult => ({ status, body });

/** Apply an ApiResult to an Express response; return the body for Nest to serialize. */
export function reply(res: Response, r: ApiResult): any {
  res.status(r.status);
  return r.body;
}
