import { HttpException, Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../global/prisma.service'
import { md5 } from '../utils'
import { CreateUserDto, UpdateUserDto } from './dto'

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
    const info = await this.prisma.user.findUnique({ where: { id: user.id } })

    if (!info) {
      throw new HttpException('该用户不存在', 400)
    }

    if (info.name !== user.name) {
      await this.checkName(user.name)
    }

    const oldPassword = md5(user.oldPassword)

    if (oldPassword !== info.password) {
      throw new HttpException('旧密码错误！', 400)
    }

    const password = md5(user.password)

    await this.prisma.user.update({
      where: { id: user.id },
      data: { name: user.name, password },
    })
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
