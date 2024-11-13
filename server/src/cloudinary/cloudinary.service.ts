import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Uploads a file buffer to Cloudinary.
   * @param file - The file buffer to upload.
   * @returns The upload result from Cloudinary.
   */
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'hyteno_todo',
          use_filename: true,
          unique_filename: true,
          overwrite: true,
        },
        (error, result) => {
          if (error) {
            if (error.http_code === 400) {
              return reject(
                new BadRequestException(
                  'Invalid file format. Please upload a valid file/image.',
                ),
              );
            } else {
              // Handle other Cloudinary errors
              return reject(
                new InternalServerErrorException('File upload failed'),
              );
            }
          }
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(uploadStream);
    });
  }
}
