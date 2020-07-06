import { IsNotEmpty } from 'class-validator';

export class ApproveRequestDTO {
  @IsNotEmpty()
  public readonly isApproved: boolean;

  @IsNotEmpty()
  public readonly isActive: boolean;
}
