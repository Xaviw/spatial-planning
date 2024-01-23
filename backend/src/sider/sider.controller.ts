import { Body, Controller, Get, Post } from '@nestjs/common'
import { SidebarService } from './sider.service'

@Controller('sider')
export class SidebarController {
  constructor(private readonly siderService: SidebarService) {}

  @Get()
  getSidebar() {}

  @Post()
  setSidebar(@Body() body: any) {
    return this.siderService.update(body)
  }
}
