import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { JwtService, JwtModuleOptions } from '@nestjs/jwt';
import { Connection } from 'typeorm';
import { DatabaseConnectionService } from '@app/db/database-connetion.service';
import { defaultJwtModuleOption } from '@app/constants/app.config';
import { UserRepository } from '@app/modules/user/user.repository';
import { TokenRepository } from '../auth.repository';
import { RoleRepository } from '@app/modules/role/role.repository';
import { RegisterDTO } from '../auth.dto';
import { ResponseModel } from '@app/constants/app.interface';

// beforeAll(as)

describe('AUTH', () => {
  let jwtOption: JwtModuleOptions;
  let connection: Connection;
  let userRepository: UserRepository;
  let tokenRepository: TokenRepository;
  let roleRepository: RoleRepository;
  let authController: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;
  beforeEach(() => {
    jwtOption = {
      secret: defaultJwtModuleOption.secret,
      signOptions: {
        expiresIn: defaultJwtModuleOption.expiresIn,
      },
    };
    jwtService = new JwtService(jwtOption);
    connection = new Connection(DatabaseConnectionService.postgresOrmOptions());
    console.log('DUC: ' + connection);
    userRepository = connection.getCustomRepository(UserRepository);
    // userService = new UserService(userRepository);
    authService = new AuthService(jwtService, tokenRepository, userRepository, roleRepository);
    authController = new AuthController(authService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
  const user: RegisterDTO = {
    email: 'test@gmail.com',
    fullName: 'Phan Van Duc',
    gender: true,
    jobPositionId: 2,
    password: 'Password',
    teamId: 2,
    token: '',
  };
  describe('Register An User', () => {
    it('Should return a new token', async () => {
      const result: Promise<ResponseModel> = null;
      jest.spyOn(authService, 'authenticate').mockImplementation(() => result);
      const createRole = await authController.register(user);
      expect(createRole).toBe(result);
    });
  });
});
