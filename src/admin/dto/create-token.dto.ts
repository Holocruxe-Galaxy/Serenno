import { IsIn, IsString } from 'class-validator';
import { PasswordListType, passwordList } from '../types/password.type';

export class CreateTokenDto {
  @IsString()
  code: string;

  @IsIn(passwordList, {
    message:
      'La clave es incorrecta. Por favor inténtelo de nuevo o consulte a quien se la brindó.',
  })
  password: PasswordListType;
}
