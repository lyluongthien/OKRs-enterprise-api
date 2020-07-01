import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @MinLength(8)
  @MaxLength(20)
  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly fullName: string;
}
