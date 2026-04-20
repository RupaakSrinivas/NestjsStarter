import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Setting } from 'src/database/models/settings.model';
import { Account } from 'src/database/models/accounts.model';
import { DataType } from './dto/create-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting)
    private settingModel: typeof Setting,
    @InjectModel(Account)
    private accountModel: typeof Account,
  ) {}

  async create(
    createSettingDto: CreateSettingDto,
    CurrentAccount: Account,
  ): Promise<Setting> {
    await this.validateAccountExists(CurrentAccount.id);

    const valueAsString = this.convertValueToString(
      createSettingDto.value,
      createSettingDto.data_type,
    );

    return this.settingModel.create({
      name: createSettingDto.name,
      data_type: createSettingDto.data_type,
      account_id: CurrentAccount.id,
      value: valueAsString,
    });
  }

  async findAll(accountId: number): Promise<Setting[]> {
    await this.validateAccountExists(accountId);
    return this.settingModel.findAll({ where: { account_id: accountId } });
  }

  async findOne(id: number, CurrentAccount: Account): Promise<Setting> {
    await this.validateAccountExists(CurrentAccount.id);

    const setting = await this.settingModel.findOne({
      where: { id: id, account_id: CurrentAccount.id },
    });

    if (!setting) {
      throw new NotFoundException(`Setting not found: ${id}`);
    }

    return setting;
  }

  private convertValueToString(value: any, dataType: DataType): string {
    switch (dataType) {
      case DataType.STRING:
        return String(value);
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

  private async validateAccountExists(accountId: number): Promise<void> {
    const account = await this.accountModel.findByPk(accountId);
    if (!account) {
      throw new NotFoundException(`Account not found: ${accountId}`);
    }
  }
}
