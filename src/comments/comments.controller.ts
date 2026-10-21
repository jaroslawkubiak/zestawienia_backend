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
import { TAuthorType } from './types/authorType.type';
import { IComment } from './types/IComment';
import { ICommentsWithSummary } from './types/ICommentsWithSummary';
import { IUnreadComments } from './types/IUnreadComments';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  // for welcome screen
  @Get('unreadComments')
  async unreadComments(): Promise<IUnreadComments> {
    return this.commentsService.unreadComments();
  }

  @Get(':positionId/getCommentsForPosition')
  findByPositionId(
    @Param('positionId') positionId: string,
  ): Promise<IComment[]> {
    return this.commentsService.findAllCommentsByPositionId(+positionId);
  }

  @Get(':fileId/getCommentsForFile')
  findByFileId(@Param('fileId') fileId: string): Promise<IComment[]> {
    return this.commentsService.findAllCommentsByFileId(+fileId);
  }

  @Get(':setId/:who/getAllCommentsForFiles')
  findAllCommentsForFiles(@Param('setId') setId: string, @Param('who') who: TAuthorType): Promise<ICommentsWithSummary> {
    return this.commentsService.getAllCommentsForFiles(+setId, who);
  }

  @Get(':setId/getCommentsForSet')
  findBySetId(@Param('setId') setId: string): Promise<IComment[]> {
    return this.commentsService.findAllCommentsBySetId(+setId);
  }

  @Post(':setHash/addComment')
  addComment(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ): Promise<IComment> {
    return this.commentsService.addComment(createCommentDto, req);
  }

  @Post(':setHash/markAllAsSeen')
  markAllCommentsAsSeen(@Body() body: IMarkAllAsSeen, @Req() req: Request) {
    return this.commentsService.markAllCommentsAsSeen(body, req);
  }

  @Patch('editComment')
  editComment(
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
  ): Promise<IComment> {
    return this.commentsService.editComment(updateCommentDto, req);
  }

  @Patch('needsAttention')
  async toggleCommentAsNeedAttention(
    @Body() body: { id: number },
    @Req() req: Request,
  ): Promise<IComment> {
    const updatedComments =
      await this.commentsService.toggleCommentAsNeedAttention(body.id, req);
    return updatedComments;
  }

  @Patch('allNeedsAttention')
  async markAllCommentsAsNeedsAttention(
    @Body() body: IMarkAllComments,
    @Req() req: Request,
  ): Promise<IComment[]> {
    return this.commentsService.markAllCommentsAsNeedsAttention(body, req);
  }

  @Delete(':id/deleteComment')
  deleteComment(@Param('id') id: string) {
    return this.commentsService.deleteComment(+id);
  }
}
