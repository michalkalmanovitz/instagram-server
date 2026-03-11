import 'reflect-metadata';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';

export const TypeormModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    schema: configService.get<string>('DB_SCHEMA'),
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: configService.get<boolean>('DB_SYNCHRONIZE') ?? false,
    extra: {
      connectionLimit: 50,
      max: 50,
    },
    connectTimeoutMS: 60000,
    retryAttempts: 2,
    retryDelay: 2000,
    keepConnectionAlive: true,
    logging: true,
  }),
});
