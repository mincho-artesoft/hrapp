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
import { calendarWeather } from './calendar-weather';
import { WebPlatformService } from './web-platform.service';

@Controller()
export class WebPlatformController {
  constructor(private readonly svc: WebPlatformService) {}

  // ── Auth & Profile ────────────────────────────────────────────────────────

  @Get('auth/providers')
  async authProviders(@Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.getAuthProviders());
  }

  @Delete('auth/web-session')
  @UseGuards(AuthGuard)
  async signOutBrowser(@Headers('authorization') authorization: string) {
    await this.svc.endWebSession(authorization.slice('Bearer '.length).trim());
    return { signedOut: true };
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

  // ── iOS QR Sign-In, TOTP Web Authenticator & Stripe Subscriptions ─────────

  @Post('auth/ios-qr/start')
  async startIosQr(
    @Headers('authorization') auth: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.startIosQrChallenge(auth ?? ''));
  }

  @Get('auth/ios-qr/info')
  @UseGuards(AuthGuard)
  async iosQrInfo(
    @Req() req: any,
    @Query('c') challengeId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.getIosQrChallengeInfo(req.principal, challengeId ?? ''));
  }

  @Post('auth/ios-qr/approve')
  @UseGuards(AuthGuard)
  async approveIosQr(
    @Req() req: any,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.approveIosQrChallenge(req.principal, body ?? {}));
  }

  @Post('auth/ios-qr/poll')
  async pollIosQr(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.pollIosQrChallenge(body ?? {}));
  }

  @Post('auth/ios-authenticator/setup')
  @UseGuards(AuthGuard)
  async setupIosAuthenticator(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.setupIosAuthenticator(req.principal));
  }

  @Get('ios/calendars/account')
  @UseGuards(AuthGuard)
  async accountLocalCalendars(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.listAccountLocalCalendars(req.principal));
  }

  @Post('ios/calendars/sync')
  @UseGuards(AuthGuard)
  async syncNativeCalendar(@Req() req: any, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.syncNativeCalendar(req.principal, body ?? {}));
  }

  @Put('ios/calendars/account/:calendarId/events/:eventId')
  @UseGuards(AuthGuard)
  async saveAccountEvent(@Req() req: any, @Param('calendarId') calendarId: string, @Param('eventId') eventId: string,
    @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.saveAccountEvent(req.principal, calendarId, eventId, body ?? {}));
  }

  @Post('ios/personal-calendar/sync')
  @UseGuards(AuthGuard)
  async syncIosPersonalCalendar(
    @Req() req: any,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.syncIosPersonalCalendar(req.principal, body ?? {}));
  }

  @Post('auth/totp/verify')
  async verifyTotp(
    @Headers('authorization') auth: string,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.verifyTotpLogin(auth ?? '', body ?? {}));
  }

  @Get('billing/plans')
  async billingPlans(@Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.getBillingPlans());
  }

  @Post('billing/checkout')
  @UseGuards(AuthGuard)
  async createBillingCheckout(
    @Req() req: any,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.createBillingCheckoutSession(req.principal, body ?? {}));
  }

  @Post('billing/reconcile')
  @UseGuards(AuthGuard)
  async reconcileBillingCheckout(
    @Req() req: any,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.reconcileBillingCheckoutSession(req.principal, body ?? {}));
  }

  @Post('billing/portal')
  @UseGuards(AuthGuard)
  async createBillingPortal(
    @Req() req: any,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.createBillingPortalSession(req.principal, body ?? {}));
  }

  @Post('billing/webhook')
  async stripeWebhook(
    @Req() req: any,
    @Headers('stripe-signature') sig: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawBody = req.rawBody ?? (Buffer.isBuffer(req.body) ? req.body : JSON.stringify(req.body ?? {}));
    return reply(res, await this.svc.handleStripeWebhook(rawBody, sig ?? ''));
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

  @Get('web-calendar/weather')
  @UseGuards(AuthGuard)
  weather(@Query() query: Record<string, unknown>) {
    return calendarWeather(query);
  }

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

  @Delete('web-calendar/device-calendars/:id')
  @UseGuards(AuthGuard)
  async removeDeviceCalendar(@Req() req: any, @Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.removeDeviceCalendarFromWeb(req.principal, id));
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
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.deleteWebCalendarEvent(req.principal, id));
  }

  @Post('web-calendar/providers/:provider')
  @UseGuards(AuthGuard)
  async providerWorkspace(@Req() req:any,@Param('provider') provider:string,@Body() body:any,@Res({passthrough:true}) res:Response){
    return reply(res,await this.svc.providerCalendarWorkspace(req.principal,provider,body??{}));
  }

  @Post('web-calendar/sync-provider')
  @UseGuards(AuthGuard)
  async syncProvider(@Req() req: any, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.syncExternalProvider(req.principal, body ?? {}));
  }

  // ── Admin Console Surface ─────────────────────────────────────────────────

  @Get('admin/overview')
  @UseGuards(AuthGuard)
  async adminOverview(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.getAdminOverview(req.principal));
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
