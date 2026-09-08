import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CalendarService } from './calendar.service';
import { AuthGuard } from '../common/auth.guard';
import { reply } from '../common/api-result';

@Controller()
export class CalendarController {
  constructor(private readonly svc: CalendarService) {}

  @Get('f/:file')
  async calendarFeed(@Param('file') file: string, @Res() res: Response) {
    const feed = await this.svc.calendarFeed(file);
    if (feed == null) {
      res.status(404).type('text/plain').send('Calendar feed not found');
      return;
    }
    res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate');
    res.status(200).type('text/calendar; charset=utf-8').send(feed);
  }

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

  /** Public landing page used by Email and QR sharing. It deliberately opens
   * the full Cloud Calendars app and never invokes the App Clip. */
  @Get('event-invites/open')
  async eventInvitationLanding(@Query() query: any, @Res() res: Response) {
    const page = await this.svc.eventInvitationLanding(query ?? {});
    res.status(page.status).type('html').send(page.html);
  }

  @Get('email-assets/shared-event-icon')
  async sharedEventEmailIcon(@Query() query: any, @Res() res: Response) {
    const image = this.svc.sharedEventEmailIcon(query?.kind, query?.color);
    if (!image) {
      res.status(400).type('text/plain').send('Invalid icon request');
      return;
    }
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    res.status(200).type('png').send(image);
  }

  @Get('email-assets/shared-event-qr')
  async sharedEventEmailQRCode(@Query('url') url: string | undefined, @Res() res: Response) {
    const image = await this.svc.sharedEventEmailQRCode(url);
    if (!image) {
      res.status(400).type('text/plain').send('Invalid QR request');
      return;
    }
    res.setHeader('Cache-Control', 'private, max-age=300');
    res.status(200).type('png').send(image);
  }

  @Get('events/:id/recipients')
  @UseGuards(AuthGuard)
  async eventRecipients(@Req() req: any, @Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.eventRecipients(req.principal, id));
  }

  @Put('events/:id/recipients')
  @UseGuards(AuthGuard)
  async saveEventRecipientChanges(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.saveEventRecipientChanges(req.principal, id, body ?? {}));
  }

  @Post('events/:id/invitations')
  @UseGuards(AuthGuard)
  async inviteEventRecipients(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.inviteEventRecipients(req.principal, id, body ?? {}));
  }

  @Get('event-invitations/pending')
  @UseGuards(AuthGuard)
  async pendingEventInvitations(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.pendingEventInvitations(req.principal));
  }

  @Post('event-invitations/pending/:eventId/decline')
  @UseGuards(AuthGuard)
  async declinePendingEventInvitation(
    @Req() req: any,
    @Param('eventId') eventId: string,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(
      res,
      await this.svc.declinePendingEventInvitation(req.principal, eventId, body ?? {}),
    );
  }

  @Get('icloud-calendars/:id/sharing')
  @UseGuards(AuthGuard)
  async iCloudCalendarSharing(
    @Req() req: any,
    @Param('id') id: string,
    @Query('ownerId') ownerId: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.iCloudCalendarSharing(req.principal, id, ownerId));
  }

  @Get('icloud-calendars-shared-with-me')
  @UseGuards(AuthGuard)
  async iCloudCalendarsSharedWithMe(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.iCloudCalendarsSharedWithMe(req.principal));
  }

  @Get('icloud-calendar-invites/open')
  async iCloudCalendarInvitationLanding(@Query() query: any, @Res() res: Response) {
    const page = await this.svc.iCloudCalendarInvitationLanding(query ?? {});
    res.status(page.status).type('html').send(page.html);
  }

  @Post('icloud-calendar-invites/accept')
  @UseGuards(AuthGuard)
  async acceptICloudCalendarInvitation(
    @Req() req: any,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.acceptICloudCalendarInvitation(req.principal, body ?? {}));
  }

  @Delete('icloud-calendars/:id/access')
  @UseGuards(AuthGuard)
  async leaveICloudCalendar(
    @Req() req: any,
    @Param('id') id: string,
    @Query('ownerId') ownerId: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(
      res,
      await this.svc.leaveICloudCalendar(req.principal, id, ownerId),
    );
  }

  @Get('icloud-calendar-invitations/pending')
  @UseGuards(AuthGuard)
  async pendingICloudCalendarInvitations(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.pendingICloudCalendarInvitations(req.principal));
  }

  @Post('icloud-calendar-invitations/pending/:calendarId/decline')
  @UseGuards(AuthGuard)
  async declinePendingICloudCalendarInvitation(
    @Req() req: any,
    @Param('calendarId') calendarId: string,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(
      res,
      await this.svc.declinePendingICloudCalendarInvitation(
        req.principal,
        calendarId,
        body ?? {},
      ),
    );
  }

  @Put('icloud-calendars/:id/sharing')
  @UseGuards(AuthGuard)
  async saveICloudCalendarSharing(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.saveICloudCalendarSharing(req.principal, id, body ?? {}));
  }

  @Post('icloud-calendars/:id/invitations')
  @UseGuards(AuthGuard)
  async inviteICloudCalendarRecipients(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(
      res,
      await this.svc.inviteICloudCalendarRecipients(req.principal, id, body ?? {}),
    );
  }

  @Delete('icloud-calendars/:id/sharing')
  @UseGuards(AuthGuard)
  async deleteICloudCalendarSharing(
    @Req() req: any,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.deleteICloudCalendarSharing(req.principal, id));
  }

  @Put('icloud-calendars/:id/events')
  @UseGuards(AuthGuard)
  async saveICloudCalendarEvents(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.saveICloudCalendarEvents(req.principal, id, body ?? {}));
  }

  @Put('events/:id/recipients/:userId')
  @UseGuards(AuthGuard)
  async updateEventRecipientAccess(
    @Req() req: any,
    @Param('id') id: string,
    @Param('userId') recipientId: string,
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(
      res,
      await this.svc.updateEventRecipientAccess(req.principal, id, recipientId, body ?? {}),
    );
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

  @Post('received-invites/anonymous')
  async rememberAnonymousReceivedInvite(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.rememberAnonymousReceivedInvite(body ?? {}));
  }

  @Post('received-invites/anonymous/forget')
  async forgetAnonymousReceivedInvite(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.forgetAnonymousReceivedInvite(body ?? {}));
  }

  @Post('received-invites/anonymous/access')
  async anonymousReceivedInviteAccess(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.anonymousReceivedInviteAccess(body ?? {}));
  }

  @Delete('received-invites/:eventId')
  @UseGuards(AuthGuard)
  async forgetReceivedInvite(@Req() req: any, @Param('eventId') eventId: string, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.forgetReceivedInvite(req.principal, eventId));
  }

  @Get('received-invites/:eventId/access')
  @UseGuards(AuthGuard)
  async receivedInviteAccess(
    @Req() req: any,
    @Param('eventId') eventId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, await this.svc.receivedInviteAccess(req.principal, eventId));
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
