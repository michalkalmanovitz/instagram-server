import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { error } from 'console';
import { CustomLogger } from 'src/core/customLogger/customLogger';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly logger: CustomLogger,
  ) {}

  async fetchByName(username: string): Promise<User | null> {
    const user: User | null = await this.userRepository.findOne({
      where: { name: username },
    });
    
    return user;
  }
}
