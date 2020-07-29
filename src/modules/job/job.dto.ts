import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class JobDTO {
  @ApiProperty()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  public description?: string;
}
export class updateJobDTO {
  @ApiProperty()
  public name: string;

  @ApiProperty()
  public description?: string;
}
