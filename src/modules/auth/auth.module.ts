import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BasicAuthStrategy } from './basic-auth.strategy';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from '../../database/models/accounts.model';

@Module({
  imports: [PassportModule, SequelizeModule.forFeature([Account])],
  providers: [BasicAuthStrategy],
})
export class AuthModule {}
