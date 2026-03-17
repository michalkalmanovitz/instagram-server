import { Injectable } from '@nestjs/common';
import { ResponseWrapper } from 'src/core/utils/ResponseWrapper';
import { User } from './user.entity';
import { UserService } from './user.service';

@Injectable()
export class UserLogic {
  constructor(
    private userService: UserService,
  ) {}

  async getByName(username:string): Promise<ResponseWrapper<User>> {
    const user: User = await this.userService.fetchByName(username);

    return new ResponseWrapper(user);
  }
}
