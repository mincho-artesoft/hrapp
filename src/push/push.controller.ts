import { Body, Controller, Param, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../common/auth.guard';
import { reply } from '../common/api-result';
import { PushService } from './push.service';

@Controller('me/push-devices')
@UseGuards(AuthGuard)
export class PushController {
  constructor(private readonly push: PushService) {}

  @Put(':installationId')
  async register(@Req() req: any, @Param('installationId') id: string, @Body() body: any,
    @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.push.register(req.principal, id, body ?? {}));
  }
}
