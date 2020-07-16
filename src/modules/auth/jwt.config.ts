import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { defaultJwtModuleOption } from '@app/constants/app.config';

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
  private jwtSecret: string = defaultJwtModuleOption.secret;
  private expiresIn: number = defaultJwtModuleOption.expiresIn;
  private defaltJwtOptions: JwtModuleOptions = {
    secret: this.jwtSecret,
    signOptions: {
      expiresIn: this.expiresIn,
    },
  };
  public createJwtOptions(): JwtModuleOptions {
    return this.defaltJwtOptions;
  }
}
