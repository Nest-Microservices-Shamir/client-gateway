import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { NatsModule } from 'src/transports/nats.module';
import { LocalStrategy } from './strategies/local.strategy';
import { CustomStrategy } from './strategies/custom.strategy';
import { APP_GUARD } from '@nestjs/core';
import { CustomGuard } from './guards/custom.guard';

@Module({
  imports:[
    NatsModule
  ],
  controllers: [
    AuthController
  ],
  providers: [
    LocalStrategy, 
    CustomStrategy,
    {
      provide: APP_GUARD,
      useClass: CustomGuard,
    },
  ],
})
export class AuthModule {}
