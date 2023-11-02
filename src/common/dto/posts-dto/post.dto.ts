import {
  IsString,
  MinLength,
  IsNotEmpty,
  IsEnum,
  IsEmpty,
} from 'class-validator';
import { Category } from 'src/common/schema/posts.schema';
import { User } from 'src/common/schema/user.schema';

export class PostsDTO {
  @IsString()
  @MinLength(3)
  caption: string;

  @IsString()
  @MinLength(3)
  description: string;

  image: string[];

  @IsNotEmpty()
  @IsEnum(Category, { message: 'Please enter correct category.' })
  readonly category: Category;

  @IsNotEmpty()
  mobile: number;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  state: string;

  @IsString()
  city: string;

  @IsString()
  userName: string = '';

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}
