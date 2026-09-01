import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CalendarService } from './calendar.service';
import { AuthGuard } from '../common/auth.guard';
import { reply } from '../common/api-result';

@Controller()
export class CalendarController {
  constructor(private readonly svc: CalendarService) {}

  @Post('register')
  async register(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.register(body ?? {}));
  }

  @Post('resolve')
  async resolve(@Req() req: Request, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    const auth = (req.headers?.authorization as string) ?? '';
    return reply(res, await this.svc.resolve(auth, body ?? {}));
  }

  @Put('events/:id')
  @UseGuards(AuthGuard)
  async upsertEvent(@Req() req: any, @Param('id') id: string, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.upsertEvent(req.principal, id, body ?? {}));
  }

  @Delete('events/:id')
  @UseGuards(AuthGuard)
  async cancelEvent(@Req() req: any, @Param('id') id: string, @Query() query: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.cancelEvent(req.principal, id, query ?? {}));
  }

  @Get('shared-state')
  @UseGuards(AuthGuard)
  async sharedState(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.sharedState(req.principal));
  }

  @Delete('identities/:provider')
  @UseGuards(AuthGuard)
  async unlinkIdentity(
    @Req() req: any,
    @Param('provider') provider: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.unlinkIdentity(req.principal, provider));
  }

  @Post('received-invites')
  @UseGuards(AuthGuard)
  async rememberReceivedInvite(@Req() req: any, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.rememberReceivedInvite(req.principal, body ?? {}));
  }

  @Delete('received-invites/:eventId')
  @UseGuards(AuthGuard)
  async forgetReceivedInvite(@Req() req: any, @Param('eventId') eventId: string, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.forgetReceivedInvite(req.principal, eventId));
  }

  @Post('grants')
  @UseGuards(AuthGuard)
  async createGrant(@Req() req: any, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.createGrant(req.principal, body ?? {}));
  }

  @Delete('grants/:id')
  @UseGuards(AuthGuard)
  async revokeGrant(@Req() req: any, @Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.revokeGrant(req.principal, id));
  }
}
