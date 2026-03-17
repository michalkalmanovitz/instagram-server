import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserLogic } from './user.logic';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService, UserLogic],
  exports: [UserService, UserLogic],
})
export class UserModule {}
