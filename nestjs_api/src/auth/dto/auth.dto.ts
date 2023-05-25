import { IsNotEmpty, Length, Matches } from "class-validator";

export class AuthDto {
  @IsNotEmpty()
  @Length(4, 20)
  @Matches(/^[A-Za-z]\w*$/, {
    message: "Must start with a Latin character and be between 4 and 20 characters long"
  })
  login: string;

  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/, {
    message: "Password is too weak. It should contain at least 1 digit, 1 lowercase letter, 1 uppercase letter and be between 8 and 16 characters long"
  })
  password: string;
}
