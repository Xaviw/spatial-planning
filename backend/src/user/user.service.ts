import * as crypto from 'crypto'
import { HttpException, Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../global/prisma.service'
import { CreateUserDto, UpdateUserDto } from './dto'

function md5(str: string) {
  const hash = crypto.createHash('md5')
  hash.update(str)
  return hash.digest('hex')
}

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService

  async register(user: CreateUserDto) {
    await this.checkName(user.name)

    user.password = md5(user.password)

    await this.prisma.user.create({ data: user })
  }

  async update(user: UpdateUserDto) {
    await this.checkName(user.name)

    user.password = md5(user.password)

    await this.prisma.user.update({ where: { id: user.id }, data: user })
  }

  async remove(id: string) {
    await this.prisma.user.update({ where: { id }, data: { isDelete: true } })
  }

  async checkName(name: string) {
    const searchUser = await this.prisma.user.findFirst({
      where: { name: name },
    })

    if (searchUser) {
      throw new HttpException('用户名已被使用', 200)
    }
  }

  async login(user: CreateUserDto) {
    const findUser = await this.prisma.user.findFirst({
      where: { name: user.name },
    })

    if (!findUser || findUser.password !== md5(user.password)) {
      throw new HttpException('用户名或密码错误！', 200)
    }

    return findUser
  }
}
