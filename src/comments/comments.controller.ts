import { Body, Controller, Param, Patch, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/comment.dto';
import { IComment } from './types/IComment';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ): Promise<IComment> {
    return this.commentsService.create(createCommentDto, req);
  }

  @Patch('read/:id')
  markAsRead(@Param('id') id: string, @Req() req: Request) {
    return this.commentsService.markAsRead(+id, req);
  }

  @Patch('/unread/:id')
  markAsUnread(@Param('id') id: string, @Req() req: Request) {
    return this.commentsService.markAsUnread(+id, req);
  }
}
