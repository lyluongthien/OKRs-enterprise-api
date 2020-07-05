import { IsNotEmpty } from 'class-validator';

export class JobDTO {
  @IsNotEmpty()
  public name: string;
}
