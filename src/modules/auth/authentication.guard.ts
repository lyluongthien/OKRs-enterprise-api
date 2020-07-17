import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '@app/db/entities/user.entity';

@Injectable()
export class AuthenticationGuard extends AuthGuard('jwt') {}
