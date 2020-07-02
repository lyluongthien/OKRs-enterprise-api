import { IsNotEmpty } from 'class-validator';

export class jobDTO {
  @IsNotEmpty()
  public name: string;
}
