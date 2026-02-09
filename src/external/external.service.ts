import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable, of, switchMap } from 'rxjs';
import { CommentsService } from '../comments/comments.service';
import { IComment } from '../comments/types/IComment';
import { SetsService } from '../sets/sets.service';
import { ISet } from '../sets/types/ISet';
import { IValidSetForClient } from '../sets/types/IValidSetForClient';
import { IValidSetForSupplier } from '../sets/types/IValidSetForSupplier';

@Injectable()
export class ExternalService {
  constructor(
    private commentsService: CommentsService,
    private setsService: SetsService,
  ) {}

  validateSetHashAndSupplierHash(
    setHash: string,
    supplierHash: string,
    req: Request,
  ): Observable<IValidSetForSupplier | null> {
    return this.setsService
      .validateSetHashAndSupplierHash(setHash, supplierHash, req)
      .pipe(
        switchMap((data) => {
          if (!data) return of(null);
          return this.setsService.getSetDataForSupplier(data);
        }),
      );
  }

  validateSetHashAndClientHash(
    setHash: string,
    clientHash: string,
    req: Request,
  ): Observable<IValidSetForClient | null> {
    return this.setsService
      .validateSetHashAndClientHash(setHash, clientHash, req)
      .pipe(
        switchMap((setId) => {
          if (!setId) {
            return of(null);
          }

          return this.setsService.getSetDataForClient(setId, 'user');
        }),
      );
  }

  async updateLastActiveClientBookmark(
    setHash: string,
    newBookmark: number,
    req: Request,
  ): Promise<ISet> {
    return this.setsService.updateLastActiveClientBookmark(
      setHash,
      +newBookmark,
      req,
    );
  }

  getCommentsForSet(
    setHash: string,
    clientHash: string,
    req: Request,
  ): Observable<IComment[] | null> {
    return this.setsService
      .validateSetHashAndClientHash(setHash, clientHash, req)
      .pipe(
        switchMap((setId) => {
          if (!setId) {
            return of(null);
          }

          return this.commentsService.findAllCommentsBySetId(setId);
        }),
      );
  }

  getCommentsForPosition(
    setHash: string,
    clientHash: string,
    positionId: number,
    req: Request,
  ): Observable<IComment[] | null> {
    return this.setsService
      .validateSetHashAndClientHash(setHash, clientHash, req)
      .pipe(
        switchMap((setId) => {
          if (!setId) {
            return of(null);
          }

          return this.commentsService.findAllCommentsByPositionId(positionId);
        }),
      );
  }
}
