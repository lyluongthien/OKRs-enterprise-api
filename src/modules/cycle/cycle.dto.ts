import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CycleDTO {
  @ApiProperty()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsNotEmpty()
  public startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  public endDate: Date;
}

export class UpdateCycleDTO {
  @ApiProperty()
  public name?: string;

  @ApiProperty()
  public startDate?: Date;

  @ApiProperty()
  public endDate?: Date;
}
