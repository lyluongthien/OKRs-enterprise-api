import { IsEmail, IsNotEmpty, Matches, IsBoolean } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @Matches(/^(?=.*\d)[0-9a-zA-Z]{8,}$/, {
    message: 'Should contain at least 1 digit and 8 characters',
  })
  @IsNotEmpty()
  public readonly password: string;

  @IsNotEmpty()
  public readonly fullName: string;
}
