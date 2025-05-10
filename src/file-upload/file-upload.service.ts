import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

// validate file types
const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
const maxSize = 5 * 1024 * 1024;

function sanitizeFilename(file: Express.Multer.File): string {
  const ext = path.extname(file.originalname);
  const base = path.basename(file.originalname, ext)
    .replace(/\s+/g, '-')              // replace spaces with hyphens
    .replace(/[^a-zA-Z0-9-_]/g, '');   // remove special characters
  const newName = `${Date.now()}-${base}${ext}`;
  const newPath = path.join(path.dirname(file.path), newName);

  // Rename the file on disk
  fs.renameSync(file.path, newPath);

  return newPath;
}
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
    const sanitizedPath = sanitizeFilename(file);

    return {
      message: 'File uploaded successfully',
      filePath: sanitizedPath,
    };
  }

  async uploadMultipleFiles(files: Express.Multer.File[]) {
    console.log({ files: files });
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
    const sanitizedPaths = files.map(file => sanitizeFilename(file));

    return {
      message: 'Files uploaded successfully',
      filePaths: sanitizedPaths,
    };
  }
}