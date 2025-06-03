import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  PayloadTooLargeException,
} from '@nestjs/common';
import { Response } from 'express';
import { MulterError } from 'multer';

@Catch()
export class FileUploadExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    if (exception instanceof MulterError) {
      if (exception.code === 'LIMIT_FILE_SIZE') {
        return response.status(400).json({
          statusCode: 400,
          message: 'File size exceeds the 2MB limit!',
          error: 'Bad Request',
        });
      } else if (exception.code === 'LIMIT_UNEXPECTED_FILE') {
        return response.status(400).json({
          statusCode: 400,
          message: 'Unexpected file field!',
          error: 'Bad Request',
        });
      }
    } else if (exception instanceof PayloadTooLargeException) {
      return response.status(413).json({
        statusCode: 413,
        message: 'File size exceeds the 2MB limit!',
        error: 'Payload Too Large',
      });
    } else if (exception instanceof BadRequestException) {
      const errorResponse = exception.getResponse();
      return response.status(400).json({
        statusCode: 400,
        message: errorResponse['message'] || 'Bad Request',
        error: 'Bad Request',
      });
    }

    console.error(exception);
    return response.status(500).json({
      statusCode: 500,
      message: 'An unexpected error occurred!',
      error: 'Internal Server Error',
    });
  }
}
