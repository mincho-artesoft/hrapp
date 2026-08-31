import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { SharedEventService } from './shared-event.service';
import { AuthGuard } from '../common/auth.guard';
import { reply } from '../common/api-result';

@Controller()
export class SharedEventController {
  constructor(private readonly svc: SharedEventService) {}

  // ── public: view + register + registrant self-management ─────────────────

  @Get('e/:handle')
  async publicEvent(@Param('handle') handle: string, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.publicEvent(handle));
  }

  @Post('e/:handle/register')
  async register(@Param('handle') handle: string, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.register(handle, body ?? {}));
  }

  @Get('registration/:token')
  async getRegistration(@Param('token') token: string, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.getRegistration(token));
  }

  @Post('registration/:token/cancel')
  async cancelRegistration(@Param('token') token: string, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.cancelRegistration(token));
  }

  // ── authenticated owner surface ──────────────────────────────────────────

  @Post('shared-events')
  @UseGuards(AuthGuard)
  async create(@Req() req: any, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.createSharedEvent(req.principal, body ?? {}));
  }

  @Get('shared-events')
  @UseGuards(AuthGuard)
  async list(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.listSharedEvents(req.principal));
  }

  @Get('shared-events/:eventId/registrants')
  @UseGuards(AuthGuard)
  async registrants(@Req() req: any, @Param('eventId') eventId: string, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.listRegistrants(req.principal, eventId));
  }

  @Post('shared-events/:eventId/reschedule')
  @UseGuards(AuthGuard)
  async reschedule(@Req() req: any, @Param('eventId') eventId: string, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.rescheduleSharedEvent(req.principal, eventId, body ?? {}));
  }

  @Post('shared-events/:eventId/cancel')
  @UseGuards(AuthGuard)
  async cancel(@Req() req: any, @Param('eventId') eventId: string, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.cancelSharedEvent(req.principal, eventId));
  }
}
