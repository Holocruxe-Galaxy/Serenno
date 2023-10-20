import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FiltersDto {
  @IsNumber()
  limit: number;

  @IsNumber()
  skip: number;

  @IsString()
  @IsOptional()
  q?: string;

  @IsString()
  @IsOptional()
  deliveryType?: string;

  @IsString()
  @IsOptional()
  deliveryPreferences?: string;

  @IsString()
  @IsOptional()
  sellerAddress?: string;

  @IsString()
  @IsOptional()
  seller?: string;

  @IsString()
  @IsOptional()
  deliveryTime?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
