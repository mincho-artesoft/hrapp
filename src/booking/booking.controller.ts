import { Body, Controller, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { BookingService } from './booking.service';
import { AuthGuard } from '../common/auth.guard';
import { reply } from '../common/api-result';

@Controller()
export class BookingController {
  constructor(private readonly svc: BookingService) {}

  // ── public invitee surface ───────────────────────────────────────────────

  @Get('book/:handle/slots')
  async slots(@Param('handle') handle: string, @Query() query: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.bookingSlots(handle, query ?? {}));
  }

  @Get('book/:handle')
  async publicBooking(@Param('handle') handle: string, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.publicBooking(handle));
  }

  @Post('book/:handle')
  async book(@Param('handle') handle: string, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.book(handle, body ?? {}));
  }

  @Get('manage/:token')
  async getManage(@Param('token') token: string, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.getManage(token));
  }

  @Post('manage/:token/reschedule')
  async reschedule(@Param('token') token: string, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.reschedule(token, body ?? {}));
  }

  @Post('manage/:token/cancel')
  async cancel(@Param('token') token: string, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.cancelBooking(token));
  }

  // ── authenticated owner surface ──────────────────────────────────────────

  @Put('booking')
  @UseGuards(AuthGuard)
  async setBooking(@Req() req: any, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.setBooking(req.principal, body ?? {}));
  }

  @Get('booking')
  @UseGuards(AuthGuard)
  async getBooking(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.getBooking(req.principal));
  }

  @Put('booking/busy')
  @UseGuards(AuthGuard)
  async setBusy(@Req() req: any, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.setBusy(req.principal, body ?? {}));
  }

  @Get('booking/events')
  @UseGuards(AuthGuard)
  async listBookingEvents(@Req() req: any, @Query() query: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.listBookingEvents(req.principal, query ?? {}));
  }

  @Post('booking/events/:id/cancel')
  @UseGuards(AuthGuard)
  async ownerCancel(@Req() req: any, @Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.ownerCancelBooking(req.principal, id));
  }

  @Post('booking/events/:id/reschedule')
  @UseGuards(AuthGuard)
  async ownerReschedule(@Req() req: any, @Param('id') id: string, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.ownerRescheduleBooking(req.principal, id, body ?? {}));
  }
}
