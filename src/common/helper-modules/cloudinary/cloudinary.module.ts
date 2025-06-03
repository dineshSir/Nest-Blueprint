import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: 'CLOUDINARY',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        cloudinary.config({
          cloud_name: configService.get('DG_CLOUDINARY_CLOUD_NAME'),
          api_key: configService.get('DG_CLOUDINARY_API_KEY'),
          api_secret: configService.get('DG_CLOUDINARY_API_SECRET'),
        });
        return cloudinary;
      },
    },
    CloudinaryService,
  ],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
