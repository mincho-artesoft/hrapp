import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { CalendarController } from './calendar/calendar.controller';
import { CalendarService } from './calendar/calendar.service';
import { MeController } from './me/me.controller';
import { MeService } from './me/me.service';
import { SharedEventController } from './shared-event/shared-event.controller';
import { SharedEventService } from './shared-event/shared-event.service';

@Module({
  imports: [CoreModule],
  controllers: [
    CalendarController,
    MeController,
    SharedEventController,
  ],
  providers: [
    CalendarService,
    MeService,
    SharedEventService,
  ],
})
export class AppModule {}
