import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CycleDTO {
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @IsNotEmpty()
  @ApiProperty()
  public startDate: Date;

  @IsNotEmpty()
  @ApiProperty()
  public endDate: Date;
}
