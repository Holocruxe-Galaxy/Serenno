import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  resource: string;

  @IsNumber()
  user_id: number;

  @IsString()
  topic: string;

  @IsNumber()
  application_id: number;

  @IsString()
  attempts: number;

  @IsDate()
  sent: Date;

  @IsDate()
  received: Date;
}
