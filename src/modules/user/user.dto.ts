import { IsNotEmpty, IsEmail, Matches } from 'class-validator';
import { passwordValidation } from '@app/constants/app.config';
import { Optional } from '@nestjs/common';
import { UserTeamDTO } from './user-team.dto';

export class ResetPasswordDTO {
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  public password: string;
}

export class UpdateUserDTO {
  @IsNotEmpty()
  @Optional()
  public isActive: boolean;

  @IsNotEmpty()
  @Optional()
  public roleId: number;

  @IsNotEmpty()
  @Optional()
  public jobPositionId: number;

  @Optional()
  public userTeam: UserTeamDTO;
}

export class ChangePasswordDTO {
  @Matches(passwordValidation.regex, {
    message: passwordValidation.message,
  })
  @IsNotEmpty()
  public password: string;
}
