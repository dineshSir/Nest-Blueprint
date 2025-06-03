import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { extname } from 'path';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile(directory: string, file: Express.Multer.File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const [yearNow, monthNow, dayNow] = [
        new Date().getFullYear(),
        new Date().getMonth(),
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
          resolve(result!.secure_url);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
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
