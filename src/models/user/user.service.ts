import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUser(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { name: username },
    });
    return user !== null;
  }

  async fetchUser(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { name: username },
    }); 
  }
}
