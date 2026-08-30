import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { CalendarController } from './calendar/calendar.controller';
import { CalendarService } from './calendar/calendar.service';
import { BookingController } from './booking/booking.controller';
import { BookingService } from './booking/booking.service';
import { MeController } from './me/me.controller';
import { MeService } from './me/me.service';
import { PairingController } from './pairing/pairing.controller';
import { PairingService } from './pairing/pairing.service';
import { BillingController } from './billing/billing.controller';
import { BillingService } from './billing/billing.service';

@Module({
  imports: [CoreModule],
  controllers: [
    CalendarController,
    BookingController,
    MeController,
    PairingController,
    BillingController,
  ],
  providers: [
    CalendarService,
    BookingService,
    MeService,
    PairingService,
    BillingService,
  ],
})
export class AppModule {}
