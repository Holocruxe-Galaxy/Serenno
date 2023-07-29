import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class NotificationDto {
  @IsString()
  resource: string;

  @IsNumber()
  user_id: number;

  @IsString()
  topic: string;

  @IsNumber()
  application_id: number;

  @IsNumber()
  attempts: number;

  @Type(() => Date)
  @IsDate()
  sent: Date;

  @Type(() => Date)
  @IsDate()
  received: Date;
}
