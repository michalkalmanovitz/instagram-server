import 'reflect-metadata';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const TypeormModule = TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    schema: configService.get<string>('DB_SCHEMA'),
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'], // here are written all the DB entities
    synchronize: configService.get<boolean>('DB_SYNCHRONIZE') ?? false, //where true all entities will be updated according to the models.
    extra: {
      connectionLimit: 50, // how many connection are open to the db concurrently
      max: 50, //the same...
    },
    connectTimeoutMS: 60000, // how much time before the connection times out,
    // here it's 60 seconds.
    // no matter what, the connection stops after this time period.
    retryAttempts: 2, //how many times to retry to connect
    retryDelay: 2000, // cooldown between failed connection to a retry
    keepConnectionAlive: true,
    logging: true, // logs the queries
  }),
  inject: [ConfigService],
});
