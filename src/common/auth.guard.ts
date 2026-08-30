import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { CoreService } from '../core/core.service';

/** The bearer-token gate. Populates `request.principal` for authed routes, or
 *  fails with the exact 401 body the original API returned. */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly core: CoreService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const header: string = req.headers?.authorization ?? req.headers?.Authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
    const principal = await this.core.resolveToken(token);
    if (!principal) throw new HttpException({ error: 'missing or invalid bearer token' }, 401);
    req.principal = principal;
    return true;
  }
}
