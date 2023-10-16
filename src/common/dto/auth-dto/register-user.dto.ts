import {
  IsString,
  IsEmail,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class RegistrationDto {
  @IsString()
  @MinLength(3)
  firstName: string;

  @IsString()
  @MinLength(3)
  lastName: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsBoolean()
  deactivated: boolean = false;
}

export class UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;
  password?: string;
}
