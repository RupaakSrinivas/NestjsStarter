import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from 'src/database/models/accounts.model';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account)
    private accountModel: typeof Account,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const existingAccount = await this.accountModel.findOne({
      where: { name: createAccountDto.name, deletedAt: null },
    });

    if (existingAccount) {
      throw new ConflictException('Account with this name already exists');
    }

    return this.accountModel.create({ name: createAccountDto.name });
  }

  async findAll(): Promise<Account[]> {
    return this.accountModel.findAll({ where: { deletedAt: null } });
  }

  async findOne(id: number): Promise<Account> {
    const account = await this.accountModel.findByPk(id);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  async remove(id: number): Promise<Account> {
    const account = await this.accountModel.findByPk(id);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    account.deletedAt = new Date();
    await account.save();
    return account;
  }
}
