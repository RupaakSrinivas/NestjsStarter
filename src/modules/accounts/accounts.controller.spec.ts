import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

describe('AccountsController', () => {
  let controller: AccountsController;
  let accountsService: {
    create: jest.Mock;
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    accountsService = {
      create: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: accountsService,
        },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create delegates to accountsService.create', async () => {
    const dto = { name: 'alice', password: 'password123' };
    const created = { id: 1, ...dto };
    accountsService.create.mockResolvedValue(created);

    const result = await controller.create(dto);

    expect(accountsService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(created);
  });

  it('findOne delegates to accountsService.findOne using current account id', async () => {
    const account = { id: 7 };
    const found = { id: 7, name: 'alice' };
    accountsService.findOne.mockResolvedValue(found);

    const result = await controller.findOne(account as any);

    expect(accountsService.findOne).toHaveBeenCalledWith(7);
    expect(result).toEqual(found);
  });
});
