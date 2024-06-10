import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CleanupService implements OnModuleInit, OnModuleDestroy {
  private readonly uploadDir = './tmp/uploads';

  constructor() {
    // Ensure the upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  onModuleInit() {
    process.on('SIGINT', this.handleShutdown.bind(this));
    process.on('SIGTERM', this.handleShutdown.bind(this));
  }

  onModuleDestroy() {
    this.cleanupUploadDirectory();
  }

  private handleShutdown() {
    this.cleanupUploadDirectory();
    process.exit(0);
  }

  private cleanupUploadDirectory() {
    const files = fs.readdirSync(this.uploadDir);
    for (const file of files) {
      try {
        fs.unlinkSync(path.join(this.uploadDir, file));
        console.log(`Deleted file: ${file}`);
      } catch (err) {
        console.error(`Failed to delete file: ${file}`, err);
      }
    }
  }
}