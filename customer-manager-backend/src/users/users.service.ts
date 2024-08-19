import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import User from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllUsers() {
    const users = await this.usersRepository.find();
    return users;
  }

  async getUserById(userId: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id: userId,
        },
      });

      return user;
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          email: email,
        },
        relations: {
          role: true,
        },
        select: ['id', 'name', 'email', 'password', 'role', 'roleId'],
      });

      return user;
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const existedUser = await this.usersRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });

      if (!existedUser) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const newUser = await this.usersRepository.create({
          name: createUserDto.name,
          email: createUserDto.email,
          password: hashedPassword,
        });

        await this.usersRepository.insert(newUser);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = newUser;

        return result;
      }
    } catch (error) {
      throw new ServiceUnavailableException();
    }

    return null;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const existedUser = await this.usersRepository.findOne({
        where: {
          id: id,
        },
      });

      if (existedUser) {
        const updatedUser = await this.usersRepository.create({
          name: updateUserDto.name,
          roleId: updateUserDto.roleId,
        });

        await this.usersRepository.update(existedUser.id, updatedUser);

        return updatedUser;
      }
    } catch (error) {
      throw new ServiceUnavailableException();
    }

    return null;
  }

  async deleteUser(id: string) {
    try {
      const existedUser = await this.usersRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!existedUser) {
        return null;
      }

      const deletingUser = { ...existedUser };

      await this.usersRepository.remove(existedUser);
      return deletingUser;
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  async updateSession(id: string, session: string) {
    try {
      const existedUser = await this.usersRepository.findOne({
        where: {
          id: id,
        },
      });

      if (existedUser) {
        let hashedSession = null;

        if (session) {
          hashedSession = await bcrypt.hash(session, 10);
        }

        await this.usersRepository.update(existedUser.id, {
          session: hashedSession,
        });

        return existedUser;
      }
    } catch (error) {
      throw new ServiceUnavailableException();
    }

    return null;
  }
}
