import { ArgumentsHost, Catch, ExceptionFilter, HttpException, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Reshapes framework errors to the exact bodies the original Lambda returned:
 * an unmatched route becomes `{ error: "no route for METHOD /path" }`, our own
 * guard's `{ error }` passes through unchanged, and anything unexpected becomes
 * a 500 `{ error: "internal error" }` — mirroring the original handler's catch.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (exception instanceof NotFoundException) {
      res.status(404).json({ error: `no route for ${req.method} ${req.path}` });
      return;
    }
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      res.status(status).json(typeof body === 'object' ? body : { error: body });
      return;
    }
    console.error('unhandled', exception);
    res.status(500).json({ error: 'internal error' });
  }
}
