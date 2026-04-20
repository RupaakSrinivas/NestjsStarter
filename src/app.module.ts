import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountsModule } from './modules/accounts/accounts.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AuthModule } from './modules/auth/auth.module';
import { Account } from './database/models/accounts.model';
import { Setting } from './database/models/settings.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'nestjs_practice',
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
