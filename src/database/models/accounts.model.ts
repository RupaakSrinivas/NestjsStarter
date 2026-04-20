import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Setting } from './settings.model';

@Table({
  tableName: 'accounts',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Account extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @HasMany(() => Setting)
  settings: Setting[];
}
