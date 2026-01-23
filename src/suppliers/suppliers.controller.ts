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
import { SetsService } from '../sets/sets.service';
import { IValidSet } from '../sets/types/IValidSet';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/supplier.dto';
import { SuppliersService } from './suppliers.service';
import { ISupplier } from './types/ISupplier';

@Controller('suppliers')
export class SuppliersController {
  constructor(
    private suppliersService: SuppliersService,
    private setsService: SetsService,
  ) {}

  // external link for suppliers
  @Get('/:hash/:supplierHash')
  validateSetAndHashForSupplier(
    @Param('hash') hash: string,
    @Param('supplierHash') supplierHash: string,
    @Req() req: Request,
  ): Observable<IValidSet> {
    return this.setsService.validateSetAndHashForSupplier(
      hash,
      supplierHash,
      req,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getSuppliers')
  findAll(): Promise<ISupplier[]> {
    return this.suppliersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/saveSupplier')
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ): Promise<ISupplier> {
    return this.suppliersService.update(+id, updateSupplierDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ISupplier> {
    return this.suppliersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('addSupplier')
  create(@Body() createSupplierDto: CreateSupplierDto): Promise<ISupplier> {
    return this.suppliersService.create(createSupplierDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteSupplier')
  remove(@Body() body: { ids: number[] }) {
    body.ids.forEach((id) => {
      return this.suppliersService.remove(+id);
    });
  }
}
