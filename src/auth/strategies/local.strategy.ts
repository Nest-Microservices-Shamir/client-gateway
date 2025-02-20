import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {
    super({ 
      usernameField: 'email'
    });
  }

  async validate(email: string, password: string): Promise<any> {

    try {
        const verifiedUser = await firstValueFrom(
            this.client.send({ cmd: 'auth.validate_credentials'}, { email, password }),
        );
        if(!verifiedUser) throw new UnauthorizedException();
        return verifiedUser
    } catch (error) {
        throw new UnauthorizedException();
    }

  }
}