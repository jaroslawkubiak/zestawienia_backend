import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NewSetDto } from './dto/NewSet.dto';
import { UpdateSetAndPositionDto } from './dto/updateSetAndPosition.dto';
import { SetsService } from './sets.service';
import { ISavedSet } from './types/ISavedSet';
import { ISet } from './types/ISet';

// @UseGuards(JwtAuthGuard)
@Controller('sets')
export class SetsController {
  constructor(private setsService: SetsService) {}

  @Get()
  findAll() {
    return this.setsService.findAll();
  }

  @Post('new')
  create(@Body() newSet: NewSetDto, @Req() req: Request): Promise<ISavedSet> {
    return this.setsService.create(newSet, req);
  }

  @Patch(':id')
  updateSet(
    @Param('id') id: string,
    @Body() updateSetDto: UpdateSetAndPositionDto,
    @Req() req: Request,
  ): Promise<any> {
    return this.setsService.update(+id, updateSetDto, req);
  }

  @Get(':setId')
  findSet(@Param('setId') setId: string): Observable<ISet> {
    return this.setsService.getSet(+setId);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.setsService.remove(+id);
  }
}
