import {
  Controller,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
  Res,
  HttpCode,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'
import { LoginGuard } from '../utils/login.guard'
import { CreateUserDto, UpdateUserDto, LoginDto } from './dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  register(@Body() user: CreateUserDto) {
    return this.userService.register(user)
  }

  @Put()
  @UseGuards(LoginGuard)
  update(@Body() user: UpdateUserDto) {
    return this.userService.update(user)
  }

  @Delete()
  @UseGuards(LoginGuard)
  remove(@Body('id') id: string) {
    return this.userService.remove(id)
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() user: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { id, name } = await this.userService.login(user)

    const accessToken = await this.jwtService.signAsync(
      { id, name },
      { expiresIn: '1h' },
    )

    const refreshToken = await this.jwtService.signAsync(
      { id },
      { expiresIn: '7d' },
    )

    response.setHeader('access-token', accessToken)
    response.setHeader('refresh-token', refreshToken)

    return { name, id }
  }
}
