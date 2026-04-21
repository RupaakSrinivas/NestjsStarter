import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Setting } from '../../database/models/settings.model';
import { Account } from '../../database/models/accounts.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, SequelizeModule.forFeature([Setting, Account])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
