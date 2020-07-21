import { IsNotEmpty } from 'class-validator';

export class CycleDTO {
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public startDate: Date;

  @IsNotEmpty()
  public endDate: Date;
}
