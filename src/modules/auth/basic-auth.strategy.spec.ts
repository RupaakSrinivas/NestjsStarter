import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BasicAuthStrategy } from './basic-auth.strategy';
import { Account } from '../../database/models/accounts.model';

describe('BasicAuthStrategy', () => {
  let strategy: BasicAuthStrategy;
  let accountModel: {
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    accountModel = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BasicAuthStrategy,
        {
          provide: getModelToken(Account),
          useValue: accountModel,
        },
      ],
    }).compile();

    strategy = module.get<BasicAuthStrategy>(BasicAuthStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('returns account when credentials are valid', async () => {
    const account = { id: 1, name: 'alice', password: 'password123' };
    accountModel.findOne.mockResolvedValue(account);

    const result = await strategy.validate('alice', 'password123');

    expect(accountModel.findOne).toHaveBeenCalledWith({
      where: { name: 'alice', deletedAt: null },
      raw: true,
    });
    expect(result).toEqual(account);
  });

  it('throws NotFoundException when account does not exist', async () => {
    accountModel.findOne.mockResolvedValue(null);

    await expect(
      strategy.validate('unknown', 'password123'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws UnauthorizedException when password is invalid', async () => {
    accountModel.findOne.mockResolvedValue({
      id: 1,
      name: 'alice',
      password: 'correct-password',
    });

    await expect(
      strategy.validate('alice', 'wrong-password'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('throws UnauthorizedException when credentials are missing', async () => {
    await expect(strategy.validate('', '')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(accountModel.findOne).not.toHaveBeenCalled();
  });
});
