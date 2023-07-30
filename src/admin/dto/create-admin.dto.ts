import { IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  grant_type: string;

  @IsString()
  refresh_token: string;

  @IsString()
  client_id: string;

  @IsString()
  client_secret: string;
}
