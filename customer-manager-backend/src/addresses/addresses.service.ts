import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Province from 'src/addresses/entities/province.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
  ) {}

  async findAllProvinces() {
    const provinces = await this.provinceRepository.find({
      relations: ['districts.wards'],
    });
    return provinces;
  }
}
