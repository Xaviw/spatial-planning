import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { UpdateSiderDto } from './dto'
import { SiderService } from './sider.service'
import { SiderPosition } from '#/business'

@Controller('sider')
export class SiderController {
  constructor(private readonly siderService: SiderService) {}

  @Get()
  getSider(
    @Query('menuId') menuId: string,
    @Query('position') position: SiderPosition,
    @Query('filter') filter: boolean,
  ) {
    return this.siderService.getList(menuId, position, filter)
  }

  @Post()
  setSider(@Body() body: UpdateSiderDto) {
    return this.siderService.update(body)
  }
}
