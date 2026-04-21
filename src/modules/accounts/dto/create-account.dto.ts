import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  declare name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  declare password: string;
}
