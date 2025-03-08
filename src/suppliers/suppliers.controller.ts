import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ISupplier } from './types/ISupplier';
import { UpdateSupplierDto, CreateSupplierDto } from './dto/supplier.dto';

// TODO remove this
// @UseGuards(JwtAuthGuard)
@Controller('suppliers')
export class SuppliersController {
  constructor(private suppliersService: SuppliersService) {}

  @Get()
  findAll() {
    return this.suppliersService.findAll();
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
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

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createSupplierDto: CreateSupplierDto): Promise<ISupplier> {
    return this.suppliersService.create(createSupplierDto);
  }

  @Delete('')
  remove(@Body() body: { ids: number[] }) {
    body.ids.forEach((id) => {
      return this.suppliersService.remove(+id);
    });
  }
}
