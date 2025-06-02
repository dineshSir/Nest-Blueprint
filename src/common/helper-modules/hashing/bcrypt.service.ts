import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { genSalt, hash, compare } from 'bcryptjs';

@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string | Buffer): Promise<string> {
    const salt = await genSalt();
    return hash(data.toString(), salt);
  }
  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return await compare(data.toString(), encrypted);
  }
}
