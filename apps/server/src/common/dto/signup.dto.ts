import { IsString, Length, Matches } from 'class-validator';

export class SignUpDto {
  @IsString() @Length(3, 20)
  username: string;

  @IsString() @Length(8, 72)
  @Matches(/^\S+$/, { message: 'Password cannot contain spaces' })
  password: string;
}