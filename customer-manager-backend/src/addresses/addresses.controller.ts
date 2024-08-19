import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import Province from 'src/addresses/entities/province.entity';
import { Public } from 'src/auth/auth.decorators';

@Public()
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  async findAllProvinces(): Promise<Province[]> {
    const provinces = await this.addressesService.findAllProvinces();
    return provinces;
  }
}
