import {
  Controller,
  Post,
  Body,
  Put,
  UseGuards,
  Res,
  HttpCode,
  Param,
  HttpException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'
import { PrismaService } from '../global/prisma.service'
import { md5 } from '../utils'
import { LoginGuard } from '../utils/login.guard'
import { UpdateUserDto, LoginDto } from './dto'

@Controller('user')
export class UserController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @Put(':id')
  @UseGuards(LoginGuard)
  async update(@Param('id') id: string, @Body() user: UpdateUserDto) {
    const info = await this.prisma.user.findUnique({
      where: { id: id },
      select: { name: true, password: true },
    })

    if (!info) {
      throw new HttpException('该用户不存在', 400)
    }

    if (info.name !== user.name) {
      const searchUser = await this.prisma.user.count({
        where: { name: user.name },
      })

      if (searchUser) {
        throw new HttpException('用户名已被使用', 200)
      }
    }

    const oldPassword = md5(user.oldPassword)

    if (oldPassword !== info.password) {
      throw new HttpException('旧密码错误！', 400)
    }

    const password = md5(user.password)

    await this.prisma.user.update({
      where: { id: id },
      data: { name: user.name, password },
    })
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() user: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const findUser = await this.prisma.user.findFirst({
      where: { name: user.name },
      select: { password: true, id: true, name: true },
    })

    if (!findUser || findUser.password !== md5(user.password)) {
      throw new HttpException('用户名或密码错误！', 200)
    }

    const accessToken = await this.jwtService.signAsync(
      { id: findUser.id },
      {
        expiresIn: '1h',
      },
    )

    const refreshToken = await this.jwtService.signAsync(
      { id: findUser.id },
      { expiresIn: '7d' },
    )

    response.setHeader('access-token', accessToken)
    response.setHeader('refresh-token', refreshToken)

    return findUser
  }
}
