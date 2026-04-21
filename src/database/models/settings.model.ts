import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Account } from './accounts.model';

@Table({
  tableName: 'settings',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Setting extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: 'settings_account_name_unique',
  })
  declare name: string;

  @Column({
    type: DataType.ENUM('string', 'number', 'boolean', 'json'),
    allowNull: false,
  })
  declare data_type: 'string' | 'number' | 'boolean' | 'json';

  @ForeignKey(() => Account)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: 'settings_account_name_unique',
  })
  declare account_id: number;

  @BelongsTo(() => Account)
  declare account: Account;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare value: string;
}
