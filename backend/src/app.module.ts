import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { CalendarController } from './calendar/calendar.controller';
import { CalendarService } from './calendar/calendar.service';
import { MeController } from './me/me.controller';
import { MeService } from './me/me.service';
import { SharedEventController } from './shared-event/shared-event.controller';
import { SharedEventService } from './shared-event/shared-event.service';
import { PushController } from './push/push.controller';
import { WebPlatformController } from './booking/web-platform.controller';
import { WebPlatformService } from './booking/web-platform.service';

@Module({
  imports: [CoreModule],
  controllers: [
    PushController,
    CalendarController,
    MeController,
    SharedEventController,
    WebPlatformController,
  ],
  providers: [
    CalendarService,
    MeService,
    SharedEventService,
    WebPlatformService,
  ],
})
export class AppModule {}
