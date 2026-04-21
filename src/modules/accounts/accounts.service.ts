import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from '../../database/models/accounts.model';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account)
    private accountModel: typeof Account,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const [account, isNew] = await this.accountModel.findOrCreate({
      where: { name: createAccountDto.name },
      defaults: {
        password: createAccountDto.password,
      },
    });

    if (!isNew) {
      throw new ConflictException('Account with the same name');
    }

    const { password, ...accountWithoutPassword } = account.toJSON();
    return accountWithoutPassword as Account;
  }

  async findOne(id: number): Promise<Account> {
    const account = await this.accountModel.findByPk(id);

    if (!account) {
      throw new ConflictException('Account not found');
    }
    return account;
  }
}
