import { Injectable } from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { ApiResult, result } from '../common/api-result';

@Injectable()
export class MeService {
  constructor(
    private readonly store: StoreService,
  ) {}

  private get keys() { return this.store.keys; }

  /** GET /me — the authenticated device/owner behind this token. */
  async whoAmI(principal: any): Promise<ApiResult> {
    return result(200, {
      principalId: principal.principalId,
      calId: principal.calId,
    });
  }
}
