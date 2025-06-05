import { Global, Module } from '@nestjs/common';
import { KhaltiModule } from 'nestjs-khalti';
import { khaltiConfig } from 'src/configurations/khalti.config';

@Global()
@Module({
  imports: [KhaltiModule.registerAsync(khaltiConfig.asProvider())],
  exports: [KhaltiModule],
})
export class KhaltiPaymentModule {}
