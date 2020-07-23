import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JobDTO {
  @IsNotEmpty()
  @ApiProperty()
  public name: string;
}
