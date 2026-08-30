import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { PairingService } from './pairing.service';
import { AuthGuard } from '../common/auth.guard';
import { reply } from '../common/api-result';

@Controller('pair')
export class PairingController {
  constructor(private readonly svc: PairingService) {}

  @Post('start')
  async start(@Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.pairStart());
  }

  @Get('status')
  async status(@Query() query: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.pairStatus(query ?? {}));
  }

  @Post('approve')
  @UseGuards(AuthGuard)
  async approve(@Req() req: any, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.pairApprove(req.principal, body ?? {}));
  }
}
