import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomLogger } from '../../core/customLogger/customLogger';
import { UserService } from './user.service';
import { UserLogic } from './user.logic';


@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userLogic: UserLogic,
    private readonly logger: CustomLogger,
  ) {}

  @Get(':username')
  async getUser( @Param('username') username: string) {
    this.logger.log(`get user named ${username}`);
    return await this.userLogic.getByName(username);
  }
}
