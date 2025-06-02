import { Global, Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { HashingService } from './hashing.service';

@Global()
@Module({
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  exports: [HashingService],
})
export class HashingModule {}
