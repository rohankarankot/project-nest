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

  @IsNotEmpty()
  image: string[];

  @IsNotEmpty()
  @IsEnum(Category, { message: 'Please enter correct category.' })
  readonly category: Category;

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}
