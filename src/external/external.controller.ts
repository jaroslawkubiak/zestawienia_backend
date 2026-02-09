import { Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IComment } from '../comments/types/IComment';
import { ISet } from '../sets/types/ISet';
import { IValidSetForClient } from '../sets/types/IValidSetForClient';
import { IValidSetForSupplier } from '../sets/types/IValidSetForSupplier';
import { ExternalService } from './external.service';

@Controller('external')
export class ExternalController {
  constructor(private externalService: ExternalService) {}

  @Get('open-for-supplier/:setHash/:supplierHash/getSetForSupplier')
  validateSetAndHashForSupplier(
    @Param('setHash') setHash: string,
    @Param('supplierHash') supplierHash: string,
    @Req() req: Request,
  ): Observable<IValidSetForSupplier | null> {
    return this.externalService.validateSetHashAndSupplierHash(
      setHash,
      supplierHash,
      req,
    );
  }

  @Get('open-for-client/:setHash/:clientHash/getSetForClient')
  validateSetAndHashForClient(
    @Param('setHash') setHash: string,
    @Param('clientHash') clientHash: string,
    @Req() req: Request,
  ): Observable<IValidSetForClient | null> {
    return this.externalService.validateSetHashAndClientHash(
      setHash,
      clientHash,
      req,
    );
  }

  @Patch(':setHash/:newBookmark/updateLastActiveClientBookmark')
  updateLastActiveClientBookmark(
    @Param('setHash') setHash: string,
    @Param('newBookmark') newBookmark: string,
    @Req() req: Request,
  ): Promise<ISet> {
    return this.externalService.updateLastActiveClientBookmark(
      setHash,
      +newBookmark,
      req,
    );
  }

  @Get(':setHash/:clientHash/getCommentsForSet')
  getCommentsForSet(
    @Param('setHash') setHash: string,
    @Param('clientHash') clientHash: string,
    @Req() req: Request,
  ): Observable<IComment[]> {
    return this.externalService.getCommentsForSet(setHash, clientHash, req);
  }

  @Get(':setHash/:clientHash/:positionId/getCommentsForPosition')
  getCommentsForPosition(
    @Param('setHash') setHash: string,
    @Param('clientHash') clientHash: string,
    @Param('positionId') positionId: string,
    @Req() req: Request,
  ): Observable<IComment[]> {
    return this.externalService.getCommentsForPosition(
      setHash,
      clientHash,
      +positionId,
      req,
    );
  }
}
