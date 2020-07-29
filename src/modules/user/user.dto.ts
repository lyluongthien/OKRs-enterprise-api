import { IsNotEmpty, IsEmail, Matches } from 'class-validator';
import { passwordValidation } from '@app/constants/app.config';
import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
export class ResetPasswordDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  public email: string;
}

export class ChangePasswordDTO {
  @Matches(passwordValidation.regex, {
    message: passwordValidation.message,
  })
  @IsNotEmpty()
  @ApiProperty()
  public password: string;

  @Matches(passwordValidation.regex, {
    message: passwordValidation.message,
  })
  @IsNotEmpty()
  @ApiProperty()
  public newPassword: string;
}

export class PasswordDTO {
  @Matches(passwordValidation.regex, {
    message: passwordValidation.message,
  })
  @IsNotEmpty()
  @ApiProperty()
  public password: string;

  @ApiProperty()
  @IsNotEmpty()
  public readonly token: string;
}

export class UserDTO {
  @Optional()
  @ApiProperty()
  public isLeader: boolean;

  @Optional()
  @ApiProperty()
  public roleId: number;

  @Optional()
  @ApiProperty()
  public teamId: number;

  @Optional()
  @ApiProperty()
  public jobPositionId: number;

  @Optional()
  @ApiProperty()
  public isActive: boolean;

  @Optional()
  @ApiProperty()
  public isApproved: boolean;
}

export class UserProfileDTO {
  @Optional()
  @ApiProperty()
  public fullName: string;

  @Optional()
  @ApiProperty()
  public avatarURl: string;

  @Optional()
  @ApiProperty()
  public gender: boolean;

  @Optional()
  @ApiProperty()
  public dateOfBirth: Date;
}

export class ResetPasswordTokenDTO {
  public resetPasswordToken: string;

  public resetPasswordTokenExpire: Date;
}

export class ApproveRequestDTO {
  public id: number[];
}
