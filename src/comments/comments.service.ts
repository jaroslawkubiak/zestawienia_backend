import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Client } from '../clients/clients.entity';
import { ErrorDto } from '../errors/dto/error.dto';
import { ErrorsType } from '../errors/types/Errors';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { Position } from '../position/positions.entity';
import { User } from '../user/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ErrorsService } from '../errors/errors.service';
import { Comment } from './comments.entity';
import { CreateCommentDto } from './dto/comment.dto';
import { IComment } from './types/IComment';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private errorsService: ErrorsService,
  ) {}

  findOne(id: number): Promise<IComment> {
    return this.commentRepo.findOneBy({ id });
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
        readByReceiver: false,
        createdAt: getFormatedDate(),
        createdAtTimestamp: Number(Date.now()),
      };

      const savedComment = await this.commentRepo.save(newComment);

      return savedComment;
    } catch (error) {
      const newError: ErrorDto = {
        type: ErrorsType.sql,
        message: 'Comment: create()',
        url: req.originalUrl,
        error: JSON.stringify(error.message) || 'null',
        query: JSON.stringify(error.query) || 'null',
        parameters: error.parameters
          ? JSON.stringify(error.parameters[0])
          : 'null',
        sql: error.driverError ? JSON.stringify(error.driverError.sql) : 'null',
        createdAt: getFormatedDate() || new Date().toISOString(),
        createdAtTimestamp: Number(Date.now()),
      };

      await this.errorsService.prepareError(newError);

      throw new InternalServerErrorException({
        message: 'Błąd bazy danych',
        error: error.message,
        details: error,
      });
    }
  }

  async markAsRead(id: number, req?: Request): Promise<IComment> {
    try {
      const originComment = await this.findOne(id);

      const updateComment = { ...originComment, readByReceiver: true };
      const updateResult = await this.commentRepo.update(id, updateComment);

      if (updateResult?.affected === 0) {
        throw new NotFoundException(`Comment with ID ${id} not found`);
      } else {
        return this.findOne(id);
      }
    } catch (error) {
      const newError: ErrorDto = {
        type: ErrorsType.sql,
        message: 'Comment: update()',
        url: req.originalUrl,
        error: JSON.stringify(error.message) || 'null',
        query: JSON.stringify(error.query) || 'null',
        parameters: error.parameters ? error.parameters[0] : 'null',
        sql: error.driverError ? error.driverError.sql : 'null',
        createdAt: getFormatedDate() || new Date().toISOString(),
        createdAtTimestamp: Number(Date.now()),
      };

      await this.errorsService.prepareError(newError);

      throw new InternalServerErrorException({
        message: 'Błąd bazy danych',
        error: error.message,
        details: error,
      });
    }
  }

  async markAsUnread(id: number, req?: Request): Promise<IComment> {
    try {
      const originComment = await this.findOne(id);

      const updateComment = { ...originComment, readByReceiver: false };
      const updateResult = await this.commentRepo.update(id, updateComment);

      if (updateResult?.affected === 0) {
        throw new NotFoundException(`Comment with ID ${id} not found`);
      } else {
        return this.findOne(id);
      }
    } catch (error) {
      const newError: ErrorDto = {
        type: ErrorsType.sql,
        message: 'Comment: update()',
        url: req.originalUrl,
        error: JSON.stringify(error.message) || 'null',
        query: JSON.stringify(error.query) || 'null',
        parameters: error.parameters ? error.parameters[0] : 'null',
        sql: error.driverError ? error.driverError.sql : 'null',
        createdAt: getFormatedDate() || new Date().toISOString(),
        createdAtTimestamp: Number(Date.now()),
      };

      await this.errorsService.prepareError(newError);

      throw new InternalServerErrorException({
        message: 'Błąd bazy danych',
        error: error.message,
        details: error,
      });
    }
  }
}
