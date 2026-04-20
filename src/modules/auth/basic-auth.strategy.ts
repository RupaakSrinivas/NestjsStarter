import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/sequelize';
import { Account } from '../../database/models/accounts.model';

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(Account)
    private accountModel: typeof Account,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<Account> {
    if (username && password) {
      const account = await this.accountModel.findOne({
        where: { name: username, deletedAt: null },
      });

      if (!account) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return account;
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
