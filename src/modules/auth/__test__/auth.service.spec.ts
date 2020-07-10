import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UserService } from '@app/modules/user/user.service';
import { JwtService, JwtModuleOptions } from '@nestjs/jwt';
import { UserRepository } from '@app/modules/user/user.repository';
import { JwtConfig } from '../jwt.config';
import { AuthResponse } from '../auth.interface';

describe('RoleController', () => {
  let jwtOption: JwtModuleOptions;
  let userRepository: UserRepository;

  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  beforeEach(() => {
    jwtOption = new JwtConfig().createJwtOptions();
    userRepository = new UserRepository();
    jwtService = new JwtService(jwtOption);
    userService = new UserService(userRepository);
    authService = new AuthService(userService, jwtService);
    authController = new AuthController(authService, userService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
  describe('Register An User', () => {
    it('Should return a new token', async () => {
      const result: Promise<AuthResponse> = null;
      jest.spyOn(authService, 'authenticate').mockImplementation(() => result);
      const createRole = await authController.register({ email: 'test@gmail.com', password: 'hello' });
      expect(createRole).toBe(result);
    });
  });
});
