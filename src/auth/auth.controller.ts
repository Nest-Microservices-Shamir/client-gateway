import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NewUserDto } from './dto/new-user.dto';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from './decorators/user.decorator';
import { IUser } from 'src/interfaces/user.interface';

@Controller('auth')
export class AuthController {

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

  @Public()
  @Post('register')
  async register(@Body() newUserDto: NewUserDto) {
    try {
      const newUser = await firstValueFrom(
        this.client.send({ cmd: 'auth.register'}, newUserDto),
      );
      return newUser;
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() userInRequest: IUser) {
    try {
      const tokens = await firstValueFrom(
        this.client.send({ cmd: 'auth.generate_jwt_token'}, userInRequest),
      );
      return tokens;
    } catch (error) {
      throw new RpcException(error)
    }
  }

  
  @Get('whoami')
  async whoami(@User() userInRequest: IUser) {

    try {
      const verifiedUser = await firstValueFrom(
        this.client.send({ cmd: 'user.find_by_email'}, { email: userInRequest.email }),
      );
      return verifiedUser;
    } catch (error) {
      throw new RpcException(error)
    }

  }

  

}
