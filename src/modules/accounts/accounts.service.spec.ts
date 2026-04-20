import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ConflictException } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from '../../database/models/accounts.model';

describe('AccountsService', () => {
  let service: AccountsService;
  let accountModel: {
    findOne: jest.Mock;
    create: jest.Mock;
    findByPk: jest.Mock;
  };

  beforeEach(async () => {
    accountModel = {
      findOne: jest.fn(),
      create: jest.fn(),
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

    accountModel.findOne.mockResolvedValue(null);
    accountModel.create.mockResolvedValue(created);

    const result = await service.create(dto);

    expect(accountModel.findOne).toHaveBeenCalledWith({
      where: { name: 'alice', deletedAt: null },
    });
    expect(accountModel.create).toHaveBeenCalledWith({
      name: 'alice',
      password: 'password123',
    });
    expect(result).toEqual(created);
  });

  it('throws ConflictException when account name already exists', async () => {
    const dto = { name: 'alice', password: 'password123' };
    accountModel.findOne.mockResolvedValue({ id: 7, name: 'alice' });

    await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
    expect(accountModel.create).not.toHaveBeenCalled();
  });

  it('findOne returns account by primary key', async () => {
    const account = { id: 5, name: 'john' };
    accountModel.findByPk.mockResolvedValue(account);

    const result = await service.findOne(5);

    expect(accountModel.findByPk).toHaveBeenCalledWith(5);
    expect(result).toEqual(account);
  });
});
