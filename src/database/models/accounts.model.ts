import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Setting } from './settings.model';

@Table({
  tableName: 'accounts',
  timestamps: true,
  paranoid: true,
  underscored: false,
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
  scopes: {
    withPassword: {
      attributes: { include: ['password'] },
    },
  },
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
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @HasMany(() => Setting)
  declare settings: Setting[];
}
