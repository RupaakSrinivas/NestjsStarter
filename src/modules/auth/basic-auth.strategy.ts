import { BasicStrategy as Strategy } from 'passport-http';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async validate(
    username: string,
    password: string,
  ): Promise<Omit<Account, 'password'>> {
    if (username && password) {
      const account = await this.accountModel.findOne({
        where: { name: username, deletedAt: null },
        raw: true,
      });

      if (!account) {
        throw new NotFoundException('Account not found');
      }
      if (account.password !== password) {
        throw new UnauthorizedException(`Invalid password`);
      }

      return account;
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
