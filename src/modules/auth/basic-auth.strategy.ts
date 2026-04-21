import { BasicStrategy as Strategy } from 'passport-http';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/sequelize';
import { Account } from '../../database/models/accounts.model';
import { timingSafeEqual } from 'crypto';

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
      const account = await this.accountModel.scope('withPassword').findOne({
        where: { name: username, deletedAt: null },
        raw: true,
      });

      const match =
        Buffer.byteLength(username) ===
          Buffer.byteLength(account?.name ?? '') &&
        Buffer.byteLength(password) ===
          Buffer.byteLength(account?.password ?? '') &&
        timingSafeEqual(
          Buffer.from(username),
          Buffer.from(account?.name ?? ''),
        ) &&
        timingSafeEqual(
          Buffer.from(password),
          Buffer.from(account?.password ?? ''),
        );

      if (account && match) {
        return account;
      } else {
        throw new NotFoundException('Account not found');
      }
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
