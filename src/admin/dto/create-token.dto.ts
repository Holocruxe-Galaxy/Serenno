import { IsIn, IsString } from 'class-validator';
import { PasswordListType, passwordList } from '../types/password.type';

export class CreateTokenDto {
  @IsString()
  code: string;

  @IsIn(passwordList)
  password: PasswordListType;
}
