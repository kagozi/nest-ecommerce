import { BadRequestException, Injectable } from '@nestjs/common';
 // validate file types
 const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
 const maxSize = 5 * 1024 * 1024;
@Injectable()

export class FileUploadService {
  async handleFileUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('no file uploaded');
    }
    // validate file type
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('invalid file type');
    }

    // validate file size (e.g., max 5mb)
    if (file.size > maxSize) {
      throw new BadRequestException('file is too large!');
    }

    return { message: 'File uploaded successfully', filePath: file.path };
  }

  async uploadMultipleFiles(files: Express.Multer.File[]) {
    console.log({files: files});
    if (!files || files.length === 0) {
      throw new BadRequestException('no files uploaded');
    }

    // validate file types
    for (const file of files) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(`invalid file type: ${file.originalname}`);
      }
    }
    // validate file sizes (e.g., max 5mb each)
    for (const file of files) {
      if (file.size > maxSize) {
        throw new BadRequestException(`file is too large: ${file.originalname}`);
      }
    }

    return { message: 'Files uploaded successfully', filePaths: files.map(file => file.path) };
  }
}