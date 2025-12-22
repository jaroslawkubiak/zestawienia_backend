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
import { IComment } from './types/IComment';
import { IMarkAllComments } from './dto/markAllComments.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('unread')
  async unreadComments(): Promise<number> {
    return this.commentsService.unreadComments();
  }

  @Get(':id')
  findBySetId(@Param('id') id: string): Promise<IComment[]> {
    return this.commentsService.findBySetId(+id);
  }

  @Post('/add')
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ): Promise<IComment> {
    return this.commentsService.create(createCommentDto, req);
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
  async markAllComments(
    @Body() body: IMarkAllComments,
    @Req() req: Request,
  ): Promise<IComment[]> {
    return this.commentsService.markAllComments(body, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
