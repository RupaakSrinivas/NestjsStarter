import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { BasicAuthGuard } from '../auth/basic-auth.gaurd';
import { UseGuards } from '@nestjs/common';
import { CurrentAccount } from '../auth/account.decorator';
import { Account } from '../../database/models/accounts.model';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  @UseGuards(BasicAuthGuard)
  findOne(@CurrentAccount() account: Account) {
    return this.accountsService.findOne(account.id);
  }
}
