import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseBoolPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { LoginGuard } from '../utils/login.guard'
import { UpdateSiderDto } from './dto'
import { SiderService } from './sider.service'

@Controller('sider')
export class SiderController {
  constructor(private readonly siderService: SiderService) {}

  @Get()
  getSider(
    @Query('menuId') menuId: string,
    @Query('position') position,
    @Query('filter', new ParseBoolPipe()) filter: boolean,
  ) {
    return this.siderService.getList(menuId, position, filter)
  }

  @Post()
  @HttpCode(200)
  @UseGuards(LoginGuard)
  async setSider(@Body() body: UpdateSiderDto['siders']) {
    await this.siderService.update(body)
  }
}
