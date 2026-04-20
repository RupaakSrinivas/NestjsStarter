import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { BasicAuthGuard } from '../auth/basic-auth.gaurd';
import { UseGuards } from '@nestjs/common';
import { CurrentAccount } from '../auth/account.decorator';
import { Account } from '../../database/models/accounts.model';

@Controller('settings')
@UseGuards(BasicAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  create(
    @Body() createSettingDto: CreateSettingDto,
    @CurrentAccount() account: Account,
  ) {
    return this.settingsService.create(createSettingDto, account.id);
  }

  @Get()
  findAll(@CurrentAccount() account: Account) {
    return this.settingsService.findAll(account.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentAccount() account: Account) {
    return this.settingsService.findOne(+id, account.id);
  }
}
