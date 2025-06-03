import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';

@Injectable()
export class S3AttachmentsStorageService {
  private readonly Bucket: string;
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get<string>(
      'STORAGE_ACCESS_KEY_ID',
    )!;
    const secretAccessKey = this.configService.get<string>(
      'STORAGE_SECRET_ACCESS_KEY',
    )!;
    const accountId = this.configService.get<string>('STORAGE_ACCOUNT_ID')!;
    this.Bucket = this.configService.get<string>('STORAGE_BUCKET_NAME')!;

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
  }

  async save(
    directory: string,
    file: Express.Multer.File,
    name?: string,
  ): Promise<string> {
    const renameNameTo =
      name ?? v4() + '_' + file.originalname.replace(/\s/g, '');
    const urlPart = directory + '/' + renameNameTo;

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.Bucket,
        Key: urlPart,
        Body: file.buffer,
      },
    });
    await upload.done();
    return urlPart;
  }
}
