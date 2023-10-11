import { Controller, Post, UseInterceptors, UploadedFile, HttpStatus, HttpException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { diskStorage } from 'multer'
import { extname } from 'path'
import { ApiTags } from '@nestjs/swagger';

const getFileUrl = (fileName: string) => {
  return `${process.env.HOST}:${process.env.PORT}/static/${fileName}`
}
@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  // @Public()
  @Post('action')
  @UseInterceptors(FileInterceptor('file', {
    // 文件存储位置
    storage: diskStorage({
      destination: './public',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    })
  }))
  async upload(@UploadedFile() file) {
    if (file && file.filename) {
      return {
        status: HttpStatus.OK,
        path: getFileUrl(file.filename),
        name: file.filename
      }
    }
    throw new HttpException({ message: "upload error", status: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST);
  }
}
