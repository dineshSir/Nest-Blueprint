import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'sms-history' })
export class SmsHistory extends CommonEntity {
  @Column({ name: 'phone_number', type: 'bigint'})
  phoneNumber: number;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  error: string;

  @Column()
  status: boolean;
}
