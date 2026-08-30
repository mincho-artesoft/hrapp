import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { MeService } from './me.service';
import { AuthGuard } from '../common/auth.guard';
import { reply } from '../common/api-result';

@Controller('me')
export class MeController {
  constructor(private readonly svc: MeService) {}

  // Public — a guest has no token, their e-mail is their identity.
  @Post('login')
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.inviteeLogin(body ?? {}));
  }

  @Get('bookings')
  async bookings(@Query() query: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.listMyBookings(query ?? {}));
  }

  // Authed — the device/owner behind a bearer token.
  @Get()
  @UseGuards(AuthGuard)
  async whoAmI(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.whoAmI(req.principal));
  }
}
