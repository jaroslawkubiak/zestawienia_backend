import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { NewSetDto } from './dto/NewSet.dto';
import { UpdateSetAndPositionDto } from './dto/updateSetAndPosition.dto';
import { SetsService } from './sets.service';
import { INewSet } from './types/INewSet';
import { ISet } from './types/ISet';

//TODO add guards
// @UseGuards(JwtAuthGuard)
@Controller('sets')
export class SetsController {
  constructor(private setsService: SetsService) {}

  @Get()
  findAll() {
    return this.setsService.findAll();
  }

  @Post('new')
  create(@Body() newSet: NewSetDto, @Req() req: Request): Promise<INewSet> {
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
  findSet(@Param('setId') setId: string): Observable<ISet[]> {
    return this.setsService.getSet(+setId);
  }
}
