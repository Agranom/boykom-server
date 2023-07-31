import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  firstName: string;

  lastName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string
}
