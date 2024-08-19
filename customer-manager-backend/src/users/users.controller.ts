import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import User from './entities/user.entity';
import {
  USER_ALREADY_EXISTED,
  USER_NOT_FOUND,
} from 'src/utils/messageConstants';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/role.enum';

@Roles(RoleEnum.Admin)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    const users = await this.usersService.getAllUsers();
    return users;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.getUserById(id);

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return user;
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.createUser(createUserDto);

    if (!newUser) {
      throw new ConflictException(USER_ALREADY_EXISTED);
    }

    return {
      message: 'Đã tạo người dùng mới',
    };
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.updateUser(id, updateUserDto);

    if (!updatedUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return {
      message: 'Đã cập nhật thông tin người dùng',
    };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const deletedUser = await this.usersService.deleteUser(id);

    if (!deletedUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return {
      message: 'Đã xóa người dùng',
    };
  }
}
