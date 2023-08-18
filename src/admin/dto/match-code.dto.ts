import { IsArray, IsIn } from 'class-validator';
import { PasswordListType, passwordList } from '../types/password.type';

export class MatchCodeDto {
  @IsArray()
  @IsIn(passwordList, { each: true })
  codes: PasswordListType[];
}
