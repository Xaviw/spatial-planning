import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { LoginGuard } from '../utils/login.guard'
import { UpdateMapDto } from './dto'
import { MapService } from './map.service'

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  getList(@Query('menuId') menuId: string, @Query('filter') filter: boolean) {
    return this.mapService.getList(menuId, filter)
  }

  @Post()
  @UseGuards(LoginGuard)
  setList(@Body() body: UpdateMapDto) {
    return this.mapService.setList(body)
  }
}
