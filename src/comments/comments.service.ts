import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { DeepPartial, Repository } from 'typeorm';
import { EmailService } from '../email/email.service';
import { ErrorDto } from '../errors/dto/error.dto';
import { ErrorsService } from '../errors/errors.service';
import { ErrorsType } from '../errors/types/Errors';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { NotificationTimerService } from '../notification-timer/notification-timer.service';
import { ENotificationDirection } from '../notification-timer/types/notification-direction.enum';
import { Position } from '../position/positions.entity';
import { Set } from '../sets/sets.entity';
import { SettingsService } from '../settings/settings.service';
import { Comment } from './comments.entity';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { IMarkAllAsSeen } from './dto/markAllAsSeen.dto';
import { IMarkAllComments } from './dto/markAllComments.dto';
import { IComment } from './types/IComment';
import { IUnreadComments } from './types/IUnreadComments';
import { TAuthorType } from './types/authorType.type';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private errorsService: ErrorsService,
    private emailService: EmailService,
    private settingService: SettingsService,
    private notificationTimerService: NotificationTimerService,
  ) {}

  async findOne(id: number): Promise<IComment> {
    const comment = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.positionId', 'position')
      .where('comment.id = :id', { id })
      .select()
      .getOne();

    return this.mapCommentToIComment(comment);
  }

  async findBySetId(setId: number): Promise<IComment[]> {
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.positionId', 'position')
      .leftJoin('comment.setId', 'set')
      .select([
        'comment.id AS id',
        'comment.comment AS comment',
        'comment.authorId AS authorId',
        'comment.authorType AS authorType',
        'comment.authorName AS authorName',
        'comment.seenAt AS seenAt',
        'comment.needsAttention AS needsAttention',
        'comment.createdAt AS createdAt',
        'comment.createdAtTimestamp AS createdAtTimestamp',
        'position.id AS positionId',
        'set.id AS setId',
      ])
      .where('comment.setId = :setId', { setId })
      .orderBy('comment.id', 'ASC')
      .getRawMany();

    const updatedComments = await Promise.all(
      comments.map(async (item) => {
        return {
          ...item,
        } satisfies IComment;
      }),
    );

    return updatedComments;
  }

  async countUnreadBySetId(
    setId: number,
    authorType: TAuthorType,
  ): Promise<IUnreadComments> {
    const unreadCount = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.setId = :setId', { setId })
      .andWhere('comment.authorType = :authorType', { authorType })
      .andWhere('comment.seenAt IS NULL')
      .getCount();

    const needAttentionCount = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.setId = :setId', { setId })
      .andWhere('comment.authorType = :authorType', { authorType })
      .andWhere('comment.needsAttention = true')
      .getCount();

    const allCommentsCount = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.setId = :setId', { setId })
      .getCount();

    return {
      unread: unreadCount,
      needsAttention: needAttentionCount,
      all: allCommentsCount,
    };
  }

  async findAllCommentsByPositionId(positionId: number): Promise<IComment[]> {
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.positionId', 'position')
      .where('comment.positionId = :positionId', { positionId })
      .select()
      .orderBy('comment.id', 'ASC')
      .getMany();

    const updatedComments = await Promise.all(
      comments.map(async (item) => {
        return this.mapCommentToIComment(item);
      }),
    );

    return updatedComments;
  }

  async findAllCommentsBySetId(setId: number): Promise<IComment[]> {
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.setId', 'set')
      .leftJoinAndSelect('comment.positionId', 'position')
      .where('comment.setId = :setId', { setId })
      .select()
      .orderBy('comment.id', 'ASC')
      .getMany();

    const updatedComments = await Promise.all(
      comments.map(async (item) => {
        return this.mapCommentToIComment(item);
      }),
    );

    return updatedComments;
  }

  async addComment(
    createCommentDto: CreateCommentDto,
    req: Request,
  ): Promise<IComment> {
    try {
      const { setId, authorType } = createCommentDto;
      const newComment: DeepPartial<Comment> = {
        ...createCommentDto,
        positionId: {
          id: createCommentDto.positionId,
        } as DeepPartial<Position>,
        setId: {
          id: setId,
        } as DeepPartial<Set>,
        needsAttention: false,
        createdAt: getFormatedDate(),
        createdAtTimestamp: Number(Date.now()),
      };

      const savedComment = await this.commentRepository.save(newComment);

      if (savedComment) {
        await this.setTimersForNotification(setId, authorType);
      }

      return this.mapCommentToIComment(savedComment);
    } catch (err) {
      const newError: ErrorDto = {
        type: ErrorsType.sql,
        message: 'Comment: create()',
        url: req.originalUrl,
        error: JSON.stringify(err?.message) || 'null',
        query: JSON.stringify(err?.query) || 'null',
        parameters: JSON.stringify(err?.parameters?.[0]) || 'null',
        sql: JSON.stringify(err?.driverError?.sql) || 'null',
        createdAt: getFormatedDate() || new Date().toISOString(),
        createdAtTimestamp: Number(Date.now()),
      };

      await this.errorsService.prepareError(newError);

      throw new InternalServerErrorException({
        message: 'Błąd bazy danych',
        error: err.message,
        details: err,
      });
    }
  }

  async editComment(
    updateCommentDto: UpdateCommentDto,
    req: Request,
  ): Promise<IComment> {
    try {
      const { commentId, ...editedComment } = updateCommentDto;

      const updateResult = await this.commentRepository.update(
        commentId,
        editedComment,
      );

      if (updateResult?.affected === 0) {
        throw new NotFoundException(`Comment with ID ${commentId} not found`);
      } else {
        return await this.findOne(commentId);
      }
    } catch (err) {
      const newError: ErrorDto = {
        type: ErrorsType.sql,
        message: 'Comment: editComment()',
        url: req.originalUrl,
        error: JSON.stringify(err?.message) || 'null',
        query: JSON.stringify(err?.query) || 'null',
        parameters: JSON.stringify(err?.parameters?.[0]) || 'null',
        sql: JSON.stringify(err?.driverError?.sql) || 'null',
        createdAt: getFormatedDate() || new Date().toISOString(),
        createdAtTimestamp: Number(Date.now()),
      };

      await this.errorsService.prepareError(newError);

      throw new InternalServerErrorException({
        message: 'Błąd bazy danych',
        error: err.message,
        details: err,
      });
    }
  }

  async markAllCommentsAsSeen(
    body: IMarkAllAsSeen,
    req?: Request,
  ): Promise<void> {
    const { positionId, authorType } = { ...body };
    const oppositeAuthorType = authorType === 'client' ? 'user' : 'client';

    try {
      await this.commentRepository
        .createQueryBuilder()
        .update(Comment)
        .set({ seenAt: () => 'CURRENT_TIMESTAMP' })
        .where('positionId = :positionId', { positionId })
        .andWhere('authorType = :authorType', {
          authorType: oppositeAuthorType,
        })
        .andWhere('seenAt IS NULL')
        .execute();
    } catch (err) {
      const newError: ErrorDto = {
        type: ErrorsType.sql,
        message: 'Comment: markAllCommentsAsSeen()',
        url: req?.originalUrl || '',
        error: JSON.stringify(err?.message) || 'null',
        query: JSON.stringify(err?.query) || 'null',
        parameters: JSON.stringify(err?.parameters) || 'null',
        sql: JSON.stringify(err?.driverError?.sql) || 'null',
        createdAt: getFormatedDate() || new Date().toISOString(),
        createdAtTimestamp: Number(Date.now()),
      };

      await this.errorsService.prepareError(newError);

      throw new InternalServerErrorException({
        message: 'Błąd bazy danych',
        error: err.message,
      });
    }
  }

  async toggleCommentAsNeedAttention(
    id: number,
    req?: Request,
  ): Promise<IComment> {
    try {
      const result = await this.commentRepository
        .createQueryBuilder()
        .update()
        .set({
          needsAttention: () => 'NOT needsAttention',
        })
        .where('id = :id', { id })
        .execute();

      if (result.affected === 0) {
        throw new NotFoundException(`Comment with ID ${id} not found`);
      } else {
        return await this.findOne(id);
      }
    } catch (err) {
      const newError: ErrorDto = {
        type: ErrorsType.sql,
        message: 'Comment: toggleCommentAsNeedAttention()',
        url: req.originalUrl,
        error: JSON.stringify(err?.message) || 'null',
        query: JSON.stringify(err?.query) || 'null',
        parameters: JSON.stringify(err?.parameters?.[0]) || 'null',
        sql: JSON.stringify(err?.driverError?.sql) || 'null',
        createdAt: getFormatedDate() || new Date().toISOString(),
        createdAtTimestamp: Number(Date.now()),
      };

      await this.errorsService.prepareError(newError);

      throw new InternalServerErrorException({
        message: 'Błąd bazy danych',
        error: err.message,
        details: err,
      });
    }
  }

  async markAllCommentsAsNeedsAttention(
    body: IMarkAllComments,
    req?: Request,
  ): Promise<IComment[]> {
    try {
      const { positionId, readState, authorType } = body;
      await this.commentRepository
        .createQueryBuilder()
        .update()
        .set({ needsAttention: readState })
        .where('positionId = :positionId', { positionId })
        .andWhere('authorType = :authorType', { authorType })
        .execute();

      return this.findAllCommentsByPositionId(positionId);
    } catch (err) {
      const newError: ErrorDto = {
        type: ErrorsType.sql,
        message: 'Comment: markAllCommentsAsNeedsAttention()',
        url: req.originalUrl,
        error: JSON.stringify(err?.message) || 'null',
        query: JSON.stringify(err?.query) || 'null',
        parameters: JSON.stringify(err?.parameters?.[0]) || 'null',
        sql: JSON.stringify(err?.driverError?.sql) || 'null',
        createdAt: getFormatedDate() || new Date().toISOString(),
        createdAtTimestamp: Number(Date.now()),
      };

      await this.errorsService.prepareError(newError);

      throw new InternalServerErrorException({
        message: 'Błąd bazy danych',
        error: err.message,
        details: err,
      });
    }
  }

  async deleteComment(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }

  async unreadComments(): Promise<IUnreadComments> {
    const result = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.setId', 'set')
      .select([
        `SUM(CASE WHEN comment.seenAt IS NULL THEN 1 ELSE 0 END) AS unread`,
        `SUM(CASE WHEN comment.needsAttention = true THEN 1 ELSE 0 END) AS needsAttention`,
      ])
      .where('comment.authorType = :authorType', { authorType: 'client' })
      .andWhere('set.status != :closedStatus', { closedStatus: 'Zamknięte' })
      .getRawOne();

    return {
      unread: Number(result.unread),
      needsAttention: Number(result.needsAttention),
      all: 0,
    };
  }

  private async setTimersForNotification(
    setId: number,
    authorType: TAuthorType,
  ) {
    /** TIMER 1: client_to_office */
    const emailFromClient =
      (
        await this.settingService.getSettingByName(
          'emailAboutNewCommentsFromClient',
        )
      ).value === 'true';

    if (emailFromClient && authorType === 'client') {
      await this.notificationTimerService.startNotificationTimer(
        setId,
        ENotificationDirection.CLIENT_TO_OFFICE,
        'office',
      );
    }

    /** TIMER 2: office_to_client */
    const emailFromOffice =
      (
        await this.settingService.getSettingByName(
          'emailAboutNewCommentsFromOffice',
        )
      ).value === 'true';

    if (emailFromOffice && authorType === 'user') {
      await this.notificationTimerService.startNotificationTimer(
        setId,
        ENotificationDirection.OFFICE_TO_CLIENT,
        'client',
      );
    }
  }

  private async sendNotificationEmail(
    setId: number,
    receiver: 'client' | 'office',
  ) {
    const allComments = await this.findBySetId(setId);
    let newComments: IComment[];
    let needsAttentionComments: IComment[];

    if (receiver === 'office') {
      // client_to_office
      newComments = allComments
        .filter((comment) => comment.authorType === 'client' && !comment.seenAt)
        .sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);

      needsAttentionComments = allComments
        .filter(
          (comment) =>
            comment.authorType === 'client' && comment.needsAttention,
        )
        .sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);

      await this.emailService.sendEmailAboutNewCommentsFromClient(
        setId,
        newComments,
        needsAttentionComments,
      );
    }

    if (receiver === 'client') {
      // office_to_client
      newComments = allComments
        .filter((comment) => comment.authorType === 'user' && !comment.seenAt)
        .sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);

      needsAttentionComments = allComments
        .filter(
          (comment) => comment.authorType === 'user' && comment.needsAttention,
        )
        .sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);

      await this.emailService.sendEmailAboutNewCommentsFromOffice(
        setId,
        newComments,
        needsAttentionComments,
      );
    }
  }

  @OnEvent('notification.timer.fired')
  async handleNotificationTimerEvent(payload: {
    setId: number;
    recipient: 'client' | 'office';
    notificationDirection: ENotificationDirection;
  }) {
    await this.sendNotificationEmail(payload.setId, payload.recipient);
  }

  private mapCommentToIComment(comment: Comment): IComment {
    return {
      id: comment.id,
      comment: comment.comment,
      authorType: comment.authorType,
      authorId: comment.authorId,
      authorName: comment.authorName,
      seenAt: comment.seenAt,
      needsAttention: comment.needsAttention,
      createdAt: comment.createdAt,
      createdAtTimestamp: comment.createdAtTimestamp,
      positionId: comment.positionId?.id,
      setId: comment.setId?.id,
    };
  }
}
