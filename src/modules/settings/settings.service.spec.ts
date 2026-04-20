import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Setting } from '../../database/models/settings.model';
import { DataType } from './dto/create-setting.dto';

describe('SettingsService', () => {
  let service: SettingsService;
  let settingModel: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    settingModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: getModelToken(Setting),
          useValue: settingModel,
        },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create stores string value as-is', async () => {
    const dto = { name: 'theme', data_type: DataType.STRING, value: 'dark' };
    const created = { id: 1, ...dto, account_id: 10 };
    settingModel.create.mockResolvedValue(created);

    const result = await service.create(dto, 10);

    expect(settingModel.create).toHaveBeenCalledWith({
      name: 'theme',
      data_type: DataType.STRING,
      account_id: 10,
      value: 'dark',
    });
    expect(result).toEqual(created);
  });

  it('create converts number value to string', async () => {
    const dto = { name: 'refresh_rate', data_type: DataType.NUMBER, value: 60 };
    settingModel.create.mockResolvedValue({ id: 2 });

    await service.create(dto, 10);

    expect(settingModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ value: '60' }),
    );
  });

  it('create converts boolean value to string', async () => {
    const dto = { name: 'enabled', data_type: DataType.BOOLEAN, value: true };
    settingModel.create.mockResolvedValue({ id: 3 });

    await service.create(dto, 10);

    expect(settingModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'true' }),
    );
  });

  it('create stringifies json object value', async () => {
    const dto = {
      name: 'payload',
      data_type: DataType.JSON,
      value: { mode: 'safe', retries: 2 },
    };
    settingModel.create.mockResolvedValue({ id: 4 });

    await service.create(dto, 10);

    expect(settingModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ value: JSON.stringify(dto.value) }),
    );
  });

  it('create preserves json string value', async () => {
    const dto = {
      name: 'payload',
      data_type: DataType.JSON,
      value: '{"mode":"safe"}',
    };
    settingModel.create.mockResolvedValue({ id: 5 });

    await service.create(dto, 10);

    expect(settingModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ value: '{"mode":"safe"}' }),
    );
  });

  it('create throws BadRequestException for invalid data type', async () => {
    const dto = { name: 'invalid', data_type: 'oops' as DataType, value: 'x' };

    await expect(service.create(dto, 10)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(settingModel.create).not.toHaveBeenCalled();
  });

  it('findAll queries settings by account id', async () => {
    const list = [{ id: 1 }, { id: 2 }];
    settingModel.findAll.mockResolvedValue(list);

    const result = await service.findAll(10);

    expect(settingModel.findAll).toHaveBeenCalledWith({
      where: { account_id: 10 },
    });
    expect(result).toEqual(list);
  });

  it('findOne returns a setting for account', async () => {
    const setting = { id: 9, account_id: 10 };
    settingModel.findOne.mockResolvedValue(setting);

    const result = await service.findOne(9, 10);

    expect(settingModel.findOne).toHaveBeenCalledWith({
      where: { id: 9, account_id: 10 },
    });
    expect(result).toEqual(setting);
  });

  it('findOne throws NotFoundException when setting does not exist', async () => {
    settingModel.findOne.mockResolvedValue(null);

    await expect(service.findOne(111, 10)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
