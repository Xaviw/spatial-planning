import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AttachmentService } from './attachment.service'

@Controller('attachment')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { dest: '/uploads' }))
  create(@UploadedFile() file: Express.Multer.File) {
    return `http://127.0.0.1:3000/static/${file.filename}`
  }

  @Get()
  findAll() {
    return this.attachmentService.findAll()
  }
}
