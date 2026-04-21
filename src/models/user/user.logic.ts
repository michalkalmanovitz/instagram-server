import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResponseWrapper } from 'src/core/utils/ResponseWrapper';
import { User } from './user.entity';
import { UserService } from './user.service';

@Injectable()
export class UserLogic {
  constructor(
    private userService: UserService,
  ) {}

  async getByName(username:string): Promise<ResponseWrapper<User>> {
    const user = await this.userService.fetchByName(username);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const response = new ResponseWrapper(user);
    return response;
  }
}
