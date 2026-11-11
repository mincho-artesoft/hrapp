import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '../common/auth.guard';
import { reply } from '../common/api-result';
import { WebPlatformService } from './web-platform.service';

@Controller()
export class WebPlatformController {
  constructor(private readonly svc: WebPlatformService) {}

  // ── Auth & Profile ────────────────────────────────────────────────────────

  @Get('auth/providers')
  async authProviders(@Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.getAuthProviders());
  }

  @Post('auth/email/request-code')
  async requestEmailCode(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.requestEmailAuthCode(body ?? {}));
  }

  @Post('auth/email/verify-code')
  async verifyEmailCode(
    @Headers('authorization') auth: string,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.verifyEmailAuthCode(auth ?? '', body ?? {}));
  }

  @Post('auth/oauth/google-code')
  async signInGoogleCode(
    @Headers('authorization') auth: string,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.signInWithGoogleAuthCode(auth ?? '', body ?? {}));
  }

  @Get('me/profile')
  @UseGuards(AuthGuard)
  async getProfile(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.getProfile(req.principal));
  }

  @Put('me/profile')
  @UseGuards(AuthGuard)
  async updateProfile(@Req() req: any, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.updateProfile(req.principal, body ?? {}));
  }

  // ── Web Calendar Workspace ────────────────────────────────────────────────

  @Get('web-calendar/state')
  @UseGuards(AuthGuard)
  async webCalendarState(@Req() req: any, @Query() query: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.getWebCalendarState(req.principal, query ?? {}));
  }

  @Put('web-calendar/settings')
  @UseGuards(AuthGuard)
  async updateCalendarSettings(@Req() req: any, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.updateProfile(req.principal, body ?? {}));
  }

  @Put('web-calendar/events/:id')
  @UseGuards(AuthGuard)
  async upsertCalendarEvent(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.upsertWebCalendarEvent(req.principal, id, body ?? {}));
  }

  @Delete('web-calendar/events/:id')
  @UseGuards(AuthGuard)
  async deleteCalendarEvent(
    @Req() req: any,
    @Param('id') id: string,
    @Query() query: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.deleteWebCalendarEvent(req.principal, id, query ?? {}));
  }

  @Post('web-calendar/sync-provider')
  @UseGuards(AuthGuard)
  async syncProvider(@Req() req: any, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.syncExternalProvider(req.principal, body ?? {}));
  }

  // ── Host Booking Configuration & Queue ────────────────────────────────────

  @Get('booking/check-handle')
  @UseGuards(AuthGuard)
  async checkHandle(@Req() req: any, @Query('h') h: string, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.checkHandleAvailability(req.principal, h));
  }

  @Get('booking/config')
  @UseGuards(AuthGuard)
  async getBookingConfig(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.getBookingConfig(req.principal));
  }

  @Put('booking/config')
  @UseGuards(AuthGuard)
  async saveBookingConfig(@Req() req: any, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.saveBookingConfig(req.principal, body ?? {}));
  }

  @Get('booking/host-bookings')
  @UseGuards(AuthGuard)
  async listHostBookings(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.listHostBookings(req.principal));
  }

  @Post('booking/host-bookings/:eventId/reschedule')
  @UseGuards(AuthGuard)
  async hostReschedule(
    @Req() req: any,
    @Param('eventId') eventId: string,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.hostRescheduleBooking(req.principal, eventId, body ?? {}));
  }

  @Post('booking/host-bookings/:eventId/cancel')
  @UseGuards(AuthGuard)
  async hostCancel(
    @Req() req: any,
    @Param('eventId') eventId: string,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.hostCancelBooking(req.principal, eventId, body ?? {}));
  }

  @Get('booking/invite-links')
  @UseGuards(AuthGuard)
  async listInviteLinks(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.listBookingInviteLinks(req.principal));
  }

  @Post('booking/invite-links')
  @UseGuards(AuthGuard)
  async createInviteLink(
    @Req() req: any,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.createBookingInviteLink(req.principal, body ?? {}));
  }

  @Delete('booking/invite-links/:token')
  @UseGuards(AuthGuard)
  async revokeInviteLink(
    @Req() req: any,
    @Param('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.revokeBookingInviteLink(req.principal, token));
  }

  // ── Public Booking Surface ────────────────────────────────────────────────

  @Get('book/:handle')
  async publicBookingPage(@Param('handle') handle: string, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.getPublicBookingPage(handle));
  }

  @Get('book/:handle/slots')
  async publicBookingSlots(
    @Param('handle') handle: string,
    @Query() query: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.getPublicBookingSlots(handle, query ?? {}));
  }

  @Post('book/:handle/request-code')
  async requestBookingCode(
    @Param('handle') handle: string,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.requestBookingVerificationCode(handle, body ?? {}));
  }

  @Post('book/:handle')
  async createBooking(
    @Headers('authorization') auth: string,
    @Param('handle') handle: string,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.createPublicBooking(auth ?? '', handle, body ?? {}));
  }

  // ── Guest Self-Service & Portal ───────────────────────────────────────────

  @Get('manage/:token')
  async getManage(@Param('token') token: string, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.getManageBooking(token));
  }

  @Post('manage/:token/reschedule')
  async guestReschedule(
    @Param('token') token: string,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.guestRescheduleByToken(token, body ?? {}));
  }

  @Post('manage/:token/cancel')
  async guestCancel(
    @Param('token') token: string,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.guestCancelByToken(token, body ?? {}));
  }

  @Post('manage/:token/sync-to-my-calendar')
  @UseGuards(AuthGuard)
  async syncManageToMyCalendar(
    @Req() req: any,
    @Param('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.syncManageBookingToMyCalendar(req.principal, token));
  }

  @Get('guest/bookings')
  @UseGuards(AuthGuard)
  async guestBookings(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.listAuthenticatedGuestBookings(req.principal));
  }

  // ── Admin Console Surface ─────────────────────────────────────────────────

  @Get('admin/overview')
  @UseGuards(AuthGuard)
  async adminOverview(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.getAdminOverview(req.principal));
  }

  @Patch('admin/hosts/:calId')
  @UseGuards(AuthGuard)
  async moderateHost(
    @Req() req: any,
    @Param('calId') calId: string,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.moderateHost(req.principal, calId, body ?? {}));
  }

  @Put('admin/settings')
  @UseGuards(AuthGuard)
  async updateAdminSettings(
    @Req() req: any,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.updateAdminSettings(req.principal, body ?? {}));
  }
}
