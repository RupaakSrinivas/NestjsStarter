import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountsModule } from './modules/accounts/accounts.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AuthModule } from './modules/auth/auth.module';
import { Account } from './database/models/accounts.model';
import { Setting } from './database/models/settings.model';
import * as dotenv from 'dotenv';

dotenv.config();
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME_DEVELOPMENT,
      models: [Account, Setting],
    }),
    AccountsModule,
    SettingsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
