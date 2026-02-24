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
  getSuppliers(): Promise<ISupplier[]> {
    return this.suppliersService.getSuppliers();
  }

  @Patch(':id/saveSupplier')
  updateSupplier(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ): Promise<ISupplier> {
    return this.suppliersService.updateSupplier(+id, updateSupplierDto);
  }

  @Post('addSupplier')
  addSupplier(
    @Body() createSupplierDto: CreateSupplierDto,
  ): Promise<ISupplier> {
    return this.suppliersService.addSupplier(createSupplierDto);
  }

  @Delete('deleteSupplier')
  deleteSupplier(@Body() body: { ids: number[] }) {
    body.ids.forEach((id) => {
      return this.suppliersService.deleteSupplier(+id);
    });
  }
}
