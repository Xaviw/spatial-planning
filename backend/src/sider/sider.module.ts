import { Module } from '@nestjs/common'
import { SidebarController } from './sider.controller'
import { SidebarService } from './sider.service'

@Module({
  controllers: [SidebarController],
  providers: [SidebarService],
})
export class SidebarModule {}
