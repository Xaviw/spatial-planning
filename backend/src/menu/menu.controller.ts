import {
  Body,
  Controller,
  Delete,
  Get,
  ParseBoolPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { LoginGuard } from '../utils/login.guard'
import { CreateMenuDto, MoveMenuDto, UpdateMenuDto } from './dto'
import { MenuService } from './menu.service'

@Controller('menu')
@UseGuards(LoginGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  getMenu(@Query('filter', new ParseBoolPipe()) filter: boolean) {
    return this.menuService.getMenu(filter)
  }

  @Post()
  createMenu(@Body() menu: CreateMenuDto) {
    if (!menu.parentId) menu.parentId = null
    return this.menuService.createMenu(menu)
  }

  @Put()
  updateMenu(@Body() menu: UpdateMenuDto) {
    return this.menuService.updateMenu(menu)
  }

  @Delete()
  removeMenu(@Body('id') id: string) {
    return this.menuService.removeMenu(id)
  }

  @Post('move')
  moveMenu(@Body() params: MoveMenuDto) {
    if (!params.currentParentId) params.currentParentId = null
    return this.menuService.moveMenu(params)
  }
}
