import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/supplier.dto';
import { SuppliersService } from './suppliers.service';
import { ISupplier } from './types/ISupplier';

@UseGuards(JwtAuthGuard)
@Controller('suppliers')
export class SuppliersController {
  constructor(private suppliersService: SuppliersService) {}

  @Get('/getSuppliers')
  findAll(): Promise<ISupplier[]> {
    return this.suppliersService.findAll();
  }

  @Patch(':id/saveSupplier')
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ): Promise<ISupplier> {
    return this.suppliersService.update(+id, updateSupplierDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ISupplier> {
    return this.suppliersService.findOne(+id);
  }

  @Post('addSupplier')
  create(@Body() createSupplierDto: CreateSupplierDto): Promise<ISupplier> {
    return this.suppliersService.create(createSupplierDto);
  }

  @Delete('deleteSupplier')
  remove(@Body() body: { ids: number[] }) {
    body.ids.forEach((id) => {
      return this.suppliersService.remove(+id);
    });
  }
}
