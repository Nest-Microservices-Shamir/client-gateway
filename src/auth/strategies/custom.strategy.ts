import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CustomStrategy extends PassportStrategy(Strategy, 'custom') {

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {
    super();
  }

  async validate(request: Request): Promise<any> {

    if (!request.headers['authorization']) {
      throw new UnauthorizedException(`token not provided`);
    }

    const token = request.headers['authorization'].split(' ')[1];

    try {
      const newUser = await firstValueFrom(
        this.client.send({ cmd: 'auth.validate_jwt_token' }, { token }),
      );
      return newUser;
    } catch (error) {
      throw new UnauthorizedException(`Token is not valid`);
    }

  }
}
