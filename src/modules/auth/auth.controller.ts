import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDTO, SignInDTO } from './auth.dto';
import { AuthResponse } from './auth.interface';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Post('/login')
  @ApiOkResponse({ description: 'Sign In with credentials' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  public async login(@Body(ValidationPipe) credentials: SignInDTO): Promise<AuthResponse> {
    return await this.authService.authenticate(credentials);
  }

  @Post('/register')
  @ApiCreatedResponse({ description: 'User Registration' })
  public async register(@Body(ValidationPipe) credentials: Partial<RegisterDTO>): Promise<AuthResponse> {
    const user = await this.userService.createUser(credentials);
    return await this.authService.createBearerToken(user);
  }
}
