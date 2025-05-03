import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { DeepPartial, Repository } from 'typeorm';
import { ClientsService } from '../clients/clients.service';
import { ErrorDto } from '../errors/dto/error.dto';
import { ErrorsService } from '../errors/errors.service';
import { ErrorsType } from '../errors/types/Errors';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { Position } from '../position/positions.entity';
import { Set } from '../sets/sets.entity';
import { UserService } from '../user/user.service';
import { Comment } from './comments.entity';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { IComment } from './types/IComment';
import { IMarkAllComments } from './dto/markAllComments.dto';

@Injectable()
export class CommentsService {
  private timers: Map<number, NodeJS.Timeout> = new Map();
  private readonly TIMEOUT_DELAY = 60 * 1000; // minuta
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private errorsService: ErrorsService,
    private clientsService: ClientsService,
    private userService: UserService,
  ) {}

  async findOne(id: number): Promise<IComment> {
    const comment = await this.commentRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.positionId', 'position')
      .where('comment.id = :id', { id })
      .select([
        'comment.id',
        'comment.comment',
        'comment.authorId',
        'comment.authorType',
        'comment.readByReceiver',
        'comment.createdAt',
        'comment.createdAtTimestamp',
        'position.id',
      ])
      .orderBy('comment.id', 'ASC')
      .getOne();

    return comment;
  }

  async findBySetId(setId: number): Promise<IComment[]> {
    const comments = await this.commentRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.positionId', 'position')
      .where('comment.setId = :setId', { setId })
      .select([
        'comment.id',
        'comment.comment',
        'comment.authorId',
        'comment.authorType',
        'comment.readByReceiver',
        'comment.createdAt',
        'comment.createdAtTimestamp',
        'position.id',
      ])
      .orderBy('comment.id', 'ASC')
      .getMany();

    const updatedComments = await Promise.all(
      comments.map(async (item) => {
        let authorName: string | undefined;

        if (item.authorType === 'client') {
          const client = await this.clientsService.findOne(item.authorId);
          authorName = client?.firstName;
        } else if (item.authorType === 'user') {
          const user = await this.userService.findOne(item.authorId);
          authorName = user?.name;
        }

        return { ...item, authorName };
      }),
    );

    return updatedComments;
  }

  async findByPositionId(positionId: number): Promise<IComment[]> {
    const comments = await this.commentRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.positionId', 'position')
      .where('comment.positionId = :positionId', { positionId })
      .select([
        'comment.id',
        'comment.comment',
        'comment.authorId',
        'comment.authorType',
        'comment.readByReceiver',
        'comment.createdAt',
        'comment.createdAtTimestamp',
        'position.id',
      ])
      .orderBy('comment.id', 'ASC')
      .getMany();

    const updatedComments = await Promise.all(
      comments.map(async (item) => {
        let authorName: string | undefined;

        if (item.authorType === 'client') {
          const client = await this.clientsService.findOne(item.authorId);
          authorName = client?.firstName;
        } else if (item.authorType === 'user') {
          const user = await this.userService.findOne(item.authorId);
          authorName = user?.name;
        }

        return { ...item, authorName };
      }),
    );

    return updatedComments;
  }

  async create(
    createCommentDto: CreateCommentDto,
    req: Request,
  ): Promise<IComment> {
    try {
      const newComment: DeepPartial<Comment> = {
        ...createCommentDto,
        positionId: {
          id: createCommentDto.positionId,
        } as DeepPartial<Position>,
        setId: {
          id: createCommentDto.setId,
        } as DeepPartial<Set>,
        readByReceiver: false,
        createdAt: getFormatedDate(),
        createdAtTimestamp: Number(Date.now()),
      };

      const savedComment = await this.commentRepo.save(newComment);

      return savedComment;
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

  async update(
    updateCommentDto: UpdateCommentDto,
    req: Request,
  ): Promise<IComment> {
    try {
      const { commentId, authorName, ...editedComment } = updateCommentDto;

      const updateResult = await this.commentRepo.update(
        commentId,
        editedComment,
      );

      if (updateResult?.affected === 0) {
        throw new NotFoundException(`Comment with ID ${commentId} not found`);
      } else {
        const newComment = await this.findOne(commentId);
        return { ...newComment, authorName };
      }
    } catch (err) {
      const newError: ErrorDto = {
        type: ErrorsType.sql,
        message: 'Comment: update()',
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

  async toggleCommentRead(id: number, req?: Request): Promise<IComment> {
    try {
      const originComment = await this.findOne(id);

      const updateComment = {
        ...originComment,
        readByReceiver: !originComment.readByReceiver,
      };
      const updateResult = await this.commentRepo.update(id, updateComment);

      if (updateResult?.affected === 0) {
        throw new NotFoundException(`Comment with ID ${id} not found`);
      } else {
        return updateComment;
      }
    } catch (err) {
      const newError: ErrorDto = {
        type: ErrorsType.sql,
        message: 'Comment: toggleCommentRead()',
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

  async markAllComments(
    body: IMarkAllComments,
    req?: Request,
  ): Promise<IComment[]> {
    try {
      const { positionId, readState, authorType } = body;

      await this.commentRepo
        .createQueryBuilder()
        .update()
        .set({ readByReceiver: readState })
        .where('positionId = :positionId', { positionId })
        .andWhere('authorType = :authorType', { authorType })
        .execute();

      return this.findByPositionId(positionId);
    } catch (err) {
      const newError: ErrorDto = {
        type: ErrorsType.sql,
        message: 'Comment: markAllComments()',
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

  async remove(id: number): Promise<void> {
    await this.commentRepo.delete(id);
  }

  /*

// comment.service.ts
import { Injectable } from '@nestjs/common';
import { MailService } from './mail.service'; // Twój serwis do wysyłki maili

@Injectable()
export class CommentService {
  private timers: Map<number, NodeJS.Timeout> = new Map();
  private readonly TIMEOUT_DELAY = 10 * 60 * 1000; // 10 minut

  constructor(private readonly mailService: MailService) {}

  async addComment(zestawienieId: number, commentDto: any) {
    // 1. Zapisz komentarz do bazy danych
    // await this.commentRepository.save({ ...commentDto, zestawienieId });

    console.log(`Dodano komentarz do zestawienia ${zestawienieId}:`, commentDto);

    // 2. Zeruj istniejący timer dla zestawienia
    if (this.timers.has(zestawienieId)) {
      clearTimeout(this.timers.get(zestawienieId));
    }

    // 3. Ustaw nowy timer
    const timer = setTimeout(async () => {
      await this.sendNotificationEmail(zestawienieId);
      this.timers.delete(zestawienieId); // Usuwamy timer po wysłaniu powiadomienia
    }, this.TIMEOUT_DELAY);

    this.timers.set(zestawienieId, timer);
  }

  private async sendNotificationEmail(zestawienieId: number) {
    console.log(`Wysyłam maila dla zestawienia ${zestawienieId}`);
    // Wyciągnij dane zestawienia jeśli potrzebujesz (np. nazwę klienta)
    // const zestawienie = await this.zestawienieRepository.findOne(zestawienieId);

    await this.mailService.sendEmail({
      to: 'admin@example.com', // możesz zmieniać na podstawie klienta
      subject: `Nowe komentarze w zestawieniu ${zestawienieId}`,
      text: `Klient zakończył dodawanie komentarzy do zestawienia ${zestawienieId}.`,
    });
  }
}



  */
}
