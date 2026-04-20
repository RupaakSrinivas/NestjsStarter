import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Setting } from '../../database/models/settings.model';
import { DataType } from './dto/create-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting)
    private settingModel: typeof Setting,
  ) {}

  async create(
    createSettingDto: CreateSettingDto,
    account_id: number,
  ): Promise<Setting> {
    const valueAsString = this.convertValueToString(
      createSettingDto.value,
      createSettingDto.data_type,
    );

    return this.settingModel.create({
      name: createSettingDto.name,
      data_type: createSettingDto.data_type,
      account_id: account_id,
      value: valueAsString,
    });
  }

  async findAll(accountId: number): Promise<Setting[]> {
    return this.settingModel.findAll({ where: { account_id: accountId } });
  }

  async findOne(id: number, accountId: number): Promise<Setting> {
    const setting = await this.settingModel.findOne({
      where: { id: id, account_id: accountId },
    });

    if (!setting) {
      throw new NotFoundException(`Setting not found: ${id}`);
    }

    return setting;
  }

  private convertValueToString(value: any, dataType: DataType): string {
    switch (dataType) {
      case DataType.STRING:
        return value;
      case DataType.NUMBER:
        return String(value);
      case DataType.BOOLEAN:
        return String(value);
      case DataType.JSON:
        return typeof value === 'string' ? value : JSON.stringify(value);
      default:
        throw new BadRequestException(`Invalid data_type: ${dataType}`);
    }
  }
}
