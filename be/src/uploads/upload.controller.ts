import { Controller, Post, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Multer } from 'multer';
import * as fs from 'fs';

@Controller('upload')
export class UploadController {
  private readonly uploadDir : string = './tmp/uploads';

  constructor() {
    // Ensure the upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor(
    [
      { name: 'files', maxCount: 10 }
    ], 
    {
      storage: diskStorage({
        destination: (req, file, callback) => {
          callback(null, './tmp/uploads');
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        }
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, 
      },
      fileFilter: (req, file, callback) => {
        if (file.mimetype !== 'audio/mpeg') {
          return callback(new BadRequestException('Only mp3 files are allowed!'), false);
        }
        callback(null, true);
      }
    }
  ))
  uploadFiles(@UploadedFiles() files: Multer.File[]) {
    if (files.length > 10) {
      throw new BadRequestException('Cannot upload more than 10 files');
    }

    console.log(files);
    return { message: 'Files uploaded successfully' };
  }
}
//all this"
//"this is a message that is not going through"