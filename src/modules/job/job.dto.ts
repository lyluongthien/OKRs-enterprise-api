import { ApiProperty } from '@nestjs/swagger';

export class JobDTO {
  @ApiProperty()
  public name: string;

  @ApiProperty()
  public description?: string;
}
