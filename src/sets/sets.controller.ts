import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { NewSetDto } from './dto/NewSet.dto';
import { SetsService } from './sets.service';
import { INewSet } from './types/INewSet';
import { IPosition } from './types/IPosition';
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
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() newSet: NewSetDto): Promise<INewSet> {
    return this.setsService.create(newSet);
  }

  @Get('/position/:setId')
  getPositions(@Param('setId') setId: string): Observable<IPosition[]> {
    return this.setsService.getPositions(+setId);
  }

  @Get(':setId')
  findSet(@Param('setId') setId: string): Observable<ISet[]> {
    return this.setsService.getSet(+setId);
  }
}
