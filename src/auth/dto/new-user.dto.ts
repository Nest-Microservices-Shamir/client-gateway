import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";


export class NewUserDto{

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;

}