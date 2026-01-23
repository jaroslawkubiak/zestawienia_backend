import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { IMarkAllAsSeen } from './dto/markAllAsSeen.dto';
import { IMarkAllComments } from './dto/markAllComments.dto';
import { IComment } from './types/IComment';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('unread')
  async unreadComments(): Promise<number> {
    return this.commentsService.unreadComments();
  }

  @Get(':positionId')
  findByPositionId(
    @Param('positionId') positionId: string,
  ): Promise<IComment[]> {
    return this.commentsService.findByPositionId(+positionId);
  }

  @Post('/add')
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ): Promise<IComment> {
    return this.commentsService.create(createCommentDto, req);
  }

  @Post('/seen')
  markCommentsAsSeen(@Body() body: IMarkAllAsSeen, @Req() req: Request) {
    return this.commentsService.markCommentsAsSeen(body, req);
  }

  @Patch('/edit')
  update(
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
  ): Promise<IComment> {
    return this.commentsService.update(updateCommentDto, req);
  }

  @Patch('')
  async toggleCommentRead(
    @Body() body: { id: number },
    @Req() req: Request,
  ): Promise<IComment> {
    const updatedComments = await this.commentsService.toggleCommentRead(
      body.id,
      req,
    );
    return updatedComments;
  }

  @Patch('positions')
  async markAllCommentsAsNeedsAttention(
    @Body() body: IMarkAllComments,
    @Req() req: Request,
  ): Promise<IComment[]> {
    return this.commentsService.markAllCommentsAsNeedsAttention(body, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
