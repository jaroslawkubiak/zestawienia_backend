import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { DeepPartial, Repository } from 'typeorm';
import { ErrorDto } from '../errors/dto/error.dto';
import { ErrorsService } from '../errors/errors.service';
import { ErrorsType } from '../errors/types/Errors';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { Position } from '../position/positions.entity';
import { Set } from '../sets/sets.entity';
import { Comment } from './comments.entity';
import { CreateCommentDto } from './dto/comment.dto';
import { IComment } from './types/IComment';
import { ClientsService } from 'src/clients/clients.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private errorsService: ErrorsService,
    private clientsService: ClientsService,
    private userService: UserService,
  ) {}

  findOne(id: number): Promise<IComment> {
    return this.commentRepo.findOneBy({ id });
  }

  async findBySetId(setId: number): Promise<IComment[]> {
    const comments = await this.commentRepo
      .createQueryBuilder('comment')
      .leftJoin('comment.positionId', 'position')
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
      .getMany();

    const updatedComments = await Promise.all(
      comments.map(async (item) => {
      let authorName: string | undefined;

      if (item.authorType === 'client') {
        const client = await this.clientsService.findOne(item.authorId);
        authorName = client?.imie;
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
}
