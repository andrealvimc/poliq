import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private database: DatabaseService) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.database.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users;
  }

  async findById(id: string): Promise<User | null> {
    return this.database.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.database.user.findUnique({
      where: { email },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.findByEmail(createUserDto.email);
    
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.database.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.findById(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const updateData: any = { ...updateUserDto };

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email já está em uso');
      }
    }

    const updatedUser = await this.database.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.database.user.delete({
      where: { id },
    });
  }

  async toggleActive(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.findById(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const updatedUser = await this.database.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }
}
