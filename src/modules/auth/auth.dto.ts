import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { passwordValidation } from '@app/constants/app.config';

export class RegisterDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @ApiProperty()
  @Matches(passwordValidation.regex, {
    message: passwordValidation.message,
  })
  @IsNotEmpty()
  public readonly password: string;

  @ApiProperty()
  @IsNotEmpty()
  public readonly fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  public readonly teamId: number;

  @ApiProperty()
  @IsNotEmpty()
  public readonly jobPositionId: number;

  @ApiProperty()
  @IsNotEmpty()
  public readonly token: string;
}

export class SignInDTO {
  @ApiProperty()
  @IsNotEmpty()
  public readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  public readonly password: string;
}

export class InviteTokenDTO {
  public token: string;
  public createdAt: Date;
}
