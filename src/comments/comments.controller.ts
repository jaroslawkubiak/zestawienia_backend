import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/comment.dto';
import { IComment } from './types/IComment';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get(':id')
  findBySetId(@Param('id') id: string): Promise<IComment[]> {
    return this.commentsService.findBySetId(+id);
  }

  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ): Promise<IComment> {
    return this.commentsService.create(createCommentDto, req);
  }

  @Patch(':id')
  markAsRead(@Param('id') id: string, @Req() req: Request) {
    return this.commentsService.markAsRead(+id, req);
  }
}
