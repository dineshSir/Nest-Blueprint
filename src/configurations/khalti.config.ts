import { registerAs } from '@nestjs/config';
import {
  KhaltiOptions,
  PaymentMode,
} from 'nestjs-khalti/dist/khalti.interface';

export const khaltiConfig = registerAs('khalti', (): KhaltiOptions => {
  const paymentMode = process.env.KHALTI_PAYMENT_MODE!;
  if (!Object.values(PaymentMode).includes(paymentMode as PaymentMode)) {
    throw new Error(`Invalid KHALTI_PAYMENT_MODE: ${paymentMode}`);
  }
  return {
    secretKey: process.env.KHALTI_SECRET_KEY!,
    paymentMode: paymentMode as PaymentMode,
  };
});
