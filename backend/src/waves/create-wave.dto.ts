import { IsString, IsOptional, IsArray, IsDateString, IsEnum } from 'class-validator';
import { WaveStatus } from '../wave-status.enum';

export class CreateWaveDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsDateString()
  startsAt: string;

  @IsDateString()
  endsAt: string;
}
