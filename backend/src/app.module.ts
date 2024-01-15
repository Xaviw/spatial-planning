import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AttachmentModule } from './attachment/attachment.module'

@Module({
  imports: [AttachmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
