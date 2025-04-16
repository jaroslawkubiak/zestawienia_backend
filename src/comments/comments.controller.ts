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

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

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
  update(@Body() updateCommentDto: UpdateCommentDto, @Req() req: Request) {
    return this.commentsService.update(updateCommentDto, req);
  }

  @Patch('')
  markAsRead(@Body() body: { ids: number[] }, @Req() req: Request) {
    body.ids.forEach((id) => {
      return this.commentsService.markAsRead(id, req);
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
