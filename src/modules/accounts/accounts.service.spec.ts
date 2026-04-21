import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ConflictException } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from '../../database/models/accounts.model';

describe('AccountsService', () => {
  let service: AccountsService;
  let accountModel: {
    findOrCreate: jest.Mock;
    findByPk: jest.Mock;
  };

  beforeEach(async () => {
    accountModel = {
      findOrCreate: jest.fn(),
      findByPk: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: getModelToken(Account),
          useValue: accountModel,
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates an account when no duplicate exists', async () => {
    const dto = { name: 'alice', password: 'password123' };
    const created = { id: 1, ...dto };

    accountModel.findOrCreate.mockResolvedValue([created, true]);

    const result = await service.create(dto);

    expect(accountModel.findOrCreate).toHaveBeenCalledWith({
      where: { name: 'alice' },
      defaults: {
        password: 'password123',
      },
    });
    expect(result).toEqual(created);
  });

  it('throws ConflictException when account name already exists', async () => {
    const dto = { name: 'alice', password: 'password123' };
    accountModel.findOrCreate.mockResolvedValue([
      { id: 7, name: 'alice' },
      false,
    ]);

    await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
    expect(accountModel.findOrCreate).toHaveBeenCalledTimes(1);
  });

  it('findOne returns account by primary key', async () => {
    const account = { id: 5, name: 'john' };
    accountModel.findByPk.mockResolvedValue(account);

    const result = await service.findOne(5);

    expect(accountModel.findByPk).toHaveBeenCalledWith(5);
    expect(result).toEqual(account);
  });
});
