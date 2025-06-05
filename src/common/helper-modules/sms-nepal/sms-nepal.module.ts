import { Global, Module } from '@nestjs/common';
import { SmsNepalService } from './sms-nepal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsHistory } from './entities/sms-history.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SmsHistory])],
  providers: [SmsNepalService],
  exports: [SmsNepalService],
})
export class SmsNepalModule {}
