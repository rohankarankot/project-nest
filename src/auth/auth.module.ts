import { Module, ValidationPipe } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { User, UserModel } from '../common/schema/user.schema';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../common/jwt.strategy';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRE'),
          },
        };
      },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserModel }]),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    AuthService,
    UserService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
