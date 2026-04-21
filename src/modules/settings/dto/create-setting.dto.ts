import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsInt,
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export enum DataType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  JSON = 'json',
}

function IsValidValue(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isValidValue',
      validator: {
        validate(value: any, args: ValidationArguments) {
          const object = args.object as CreateSettingDto;
          const dataType = object.data_type;

          switch (dataType) {
            case DataType.STRING:
              return typeof value === 'string';
            case DataType.NUMBER:
              return typeof value === 'number' && !isNaN(value);
            case DataType.BOOLEAN:
              return typeof value === 'boolean';
            case DataType.JSON:
              if (typeof value === 'object' && value !== null) {
                return true;
              }
              return false;
            default:
              return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          const object = args.object as CreateSettingDto;
          return `Value must be of type ${object.data_type}`;
        },
      },
    },
    validationOptions,
  );
}

export class CreateSettingDto {
  @IsString()
  @IsNotEmpty()
  declare name: string;

  @IsEnum(DataType)
  declare data_type: DataType;

  @IsNotEmpty()
  @IsValidValue()
  declare value: any;
}
