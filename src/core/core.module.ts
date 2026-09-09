import { Global, Module } from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { EmailService } from '../email/email.service';
import { CoreService } from './core.service';
import { AuthGuard } from '../common/auth.guard';
import { APNsService } from '../push/apns.service';
import { PushService } from '../push/push.service';

/** Shared infrastructure — S3 store, SES email, calendar mechanics, auth guard —
 *  made global so every feature module can inject them without re-importing. */
@Global()
@Module({
  providers: [StoreService, EmailService, CoreService, AuthGuard, APNsService, PushService],
  exports: [StoreService, EmailService, CoreService, AuthGuard, PushService],
})
export class CoreModule {}
