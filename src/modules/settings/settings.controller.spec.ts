import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

describe('SettingsController', () => {
  let controller: SettingsController;
  let settingsService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    settingsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        {
          provide: SettingsService,
          useValue: settingsService,
        },
      ],
    }).compile();

    controller = module.get<SettingsController>(SettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create delegates to settingsService.create with account id', async () => {
    const dto = { name: 'theme', data_type: 'string', value: 'dark' };
    const account = { id: 3 };
    const created = { id: 11, ...dto, account_id: 3 };
    settingsService.create.mockResolvedValue(created);

    const result = await controller.create(dto as any, account as any);

    expect(settingsService.create).toHaveBeenCalledWith(dto, 3);
    expect(result).toEqual(created);
  });

  it('findAll delegates to settingsService.findAll with account id', async () => {
    const account = { id: 3 };
    const list = [{ id: 1 }, { id: 2 }];
    settingsService.findAll.mockResolvedValue(list);

    const result = await controller.findAll(account as any);

    expect(settingsService.findAll).toHaveBeenCalledWith(3);
    expect(result).toEqual(list);
  });

  it('findOne converts id to number and delegates to settingsService.findOne', async () => {
    const account = { id: 3 };
    const found = { id: 42 };
    settingsService.findOne.mockResolvedValue(found);

    const result = await controller.findOne('42', account as any);

    expect(settingsService.findOne).toHaveBeenCalledWith(42, 3);
    expect(result).toEqual(found);
  });
});
