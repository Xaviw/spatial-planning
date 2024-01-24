import { Module } from '@nestjs/common'
import { SiderController } from './sider.controller'
import { SiderService } from './sider.service'

@Module({
  controllers: [SiderController],
  providers: [SiderService],
})
export class SiderModule {}
