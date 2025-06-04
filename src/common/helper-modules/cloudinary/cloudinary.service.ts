import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiErrorResponse } from 'cloudinary';
import { extname } from 'path';
import { CloudinaryResponseInterface } from 'src/common/interfaces/cloudinary-response.interface';
import { DeletedInterface } from 'src/common/interfaces/crud-response.interface';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get('DG_CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get('DG_CLOUDINARY_API_KEY'),
      api_secret: configService.get('DG_CLOUDINARY_API_SECRET'),
    });
  }
  uploadFile(
    directory: string,
    file: Express.Multer.File,
  ): Promise<CloudinaryResponseInterface | UploadApiErrorResponse> {
    return new Promise<CloudinaryResponseInterface | UploadApiErrorResponse>(
      (resolve, reject) => {
        const [yearNow, monthNow, dayNow] = [
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          new Date().getDay(),
        ];
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `${directory}/${yearNow}/${monthNow}/${dayNow}`,
            resource_type: 'auto',
            public_id: `${file.originalname.replace(extname(file.originalname), '')}_${Date.now()}`,
            format: extname(file.originalname).replace('.', ''),
          },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              file_original_name: result?.original_filename!,
              file_url: result?.secure_url!,
              fiile_folder: result?.asset_folder!,
              file_size: `${result?.bytes} bytes`!,
              file_public_id: result?.public_id!,
            });
          },
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      },
    );
  }

  async deleteFile(publicId: string): Promise<DeletedInterface> {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result);
    if (result.result == 'not found') throw new NotFoundException();
    else if (result.result == 'ok')
      return {
        success: true,
        message: `File deleted successfully from cloudinary server.`,
      };
    else
      throw new InternalServerErrorException(
        `Error while deleting file from cloudinary server hohoho. `,
      );
  }
}

//calling this service

// @Post()
// @UseFilters(FileUploadExceptionFilter)
// @UseInterceptors(
//   FileInterceptor('file', {
//     limits: { fileSize: 2 * 1024 * 1024 },
//     fileFilter: (request, file, callback) => {
//       if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
//         return callback(
//           new BadRequestException('Only image files are allowed!'),
//           false,
//         );
//       }
//       callback(null, true);
//     },
//   }),
// )
// async uploadImage(@UploadedFile() file: Express.Multer.File) {
//   console.log(file);
//   const folderName = this.configService.get<string>(
//     'DG_CLOUDINARY_FOLDER_NAME',
//   );
//   console.log(folderName);
//   const response = await this.cloudinaryService.uploadFile(folderName!, file);
//   console.log(response);
//   return;
// }

// @Delete()
// async remove(@Body() body: { filePublicId: string }) {
//   const [response, error] = await safeError(
//     this.cloudinaryService.deleteFile(body.filePublicId),
//   );
//   if (error) {
//     if (error instanceof NotFoundException) {
//       console.log('hello');
//       throw new NotFoundException(
//         `File with public id ${body.filePublicId} not found.`,
//       );
//     }
//     throw new InternalServerErrorException(
//       `Error while deleting file from cloudinary server. `,
//     );
//   }
//   return response;
// }
