import { Injectable } from '@nestjs/common'
import { CreateAttachmentDto } from './dto/create-attachment.dto'
import { UpdateAttachmentDto } from './dto/update-attachment.dto'

@Injectable()
export class AttachmentService {
  create(_createAttachmentDto: CreateAttachmentDto) {
    return 'This action adds a new attachment'
  }

  findAll() {
    return 'This action returns all attachment'
  }

  findOne(id: number) {
    return `This action returns a #${id} attachment`
  }

  update(id: number, _updateAttachmentDto: UpdateAttachmentDto) {
    return `This action updates a #${id} attachment`
  }

  remove(id: number) {
    return `This action removes a #${id} attachment`
  }
}
