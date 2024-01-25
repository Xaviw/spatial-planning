import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  getMenu(@Query('filter', new ParseBoolPipe()) filter: boolean) {
    return this.menuService.getMenu(filter)
  }

  @Post()
  @UseGuards(LoginGuard)
  createMenu(@Body() menu: CreateMenuDto) {
    if (!menu.parentId) menu.parentId = null
    return this.menuService.createMenu(menu)
  }

  @Put(':id')
  @UseGuards(LoginGuard)
  updateMenu(@Param('id') id: string, @Body() menu: UpdateMenuDto) {
    return this.menuService.updateMenu(id, menu)
  }

  @Delete(':id')
  @UseGuards(LoginGuard)
  removeMenu(@Param('id') id: string) {
    return this.menuService.removeMenu(id)
  }

  @Post('move/:id')
  @UseGuards(LoginGuard)
  moveMenu(@Param('id') id: string, @Body() params: MoveMenuDto) {
    if (!params.currentParentId) params.currentParentId = null
    return this.menuService.moveMenu(id, params)
  }
}
