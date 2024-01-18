import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateMenuDto, MoveMenuDto, UpdateMenuDto } from './dto'
import type { MenuItem } from '#/business'

@Injectable()
export class MenuService {
  @Inject(PrismaService)
  private prisma!: PrismaService

  async getMenu(filter: boolean) {
    const menus = (await this.prisma.menu.findMany({
      where: {
        status: filter || undefined,
        isDelete: false,
      },
      select: {
        id: true,
        parentId: true,
        name: true,
        sort: !filter,
        status: !filter,
        createTime: !filter,
        updateTime: !filter,
      },
      orderBy: { sort: 'asc' },
    })) as unknown as MenuItem[]

    const maps = new Map(menus.map(item => [item.id, item]))

    const result: MenuItem[] = []

    for (const menu of menus) {
      if (menu.parentId) {
        const target = maps.get(menu.parentId)
        if (target) {
          if (!target.children) {
            target.children = []
          }
          target.children.push(menu)
        }
      } else {
        result.push(menu)
      }
    }
    return result
  }

  async createMenu(menu: CreateMenuDto) {
    const maxSort = await this.prisma.menu.aggregate({
      where: { parentId: menu.parentId || null },
      _max: { sort: true },
    })

    const sort =
      typeof maxSort._max.sort === 'number' ? maxSort._max.sort + 1 : 0

    const newMenu = await this.prisma.menu.create({
      data: { ...menu, sort },
    })

    return newMenu.id
  }

  async updateMenu(menu: UpdateMenuDto) {
    await this.prisma.menu.update({ where: { id: menu.id }, data: menu })

    return true
  }

  async removeMenu(id: string) {
    // 逻辑删除
    await this.prisma.menu.update({ where: { id }, data: { isDelete: true } })

    return true
  }

  async moveMenu(params: MoveMenuDto) {
    const menu = await this.prisma.menu.findFirst({ where: { id: params.id } })
    if (!menu) {
      throw new BadRequestException('当前菜单已被删除，请刷新页面！')
    }

    if (menu.parentId !== params.currentParentId) {
      // 移动父级时，原先后面数据的sort-1
      await this.prisma.menu.updateMany({
        where: { parentId: menu.parentId, sort: { gt: menu.sort } },
        data: { sort: { decrement: 1 } },
      })
      // 新父级中目标sort及后续的数据sort+1
      await this.prisma.menu.updateMany({
        where: {
          parentId: params.currentParentId,
          sort: { gte: params.currentIndex },
        },
        data: { sort: { increment: 1 } },
      })
    } else if (params.currentIndex < menu.sort) {
      // 向前移动时：移动区间数据sort+1
      await this.prisma.menu.updateMany({
        where: {
          parentId: menu.parentId,
          sort: { gte: params.currentIndex, lt: menu.sort },
        },
        data: { sort: { increment: 1 } },
      })
    } else if (params.currentIndex > menu.sort) {
      // 向后移动时：移动区间数据sort-1
      await this.prisma.menu.updateMany({
        where: {
          parentId: menu.parentId,
          sort: { gt: menu.sort, lte: params.currentIndex },
        },
        data: { sort: { decrement: 1 } },
      })
    }
    // 修改目标数据parentId和sort
    await this.prisma.menu.update({
      where: { id: menu.id },
      data: { parentId: params.currentParentId, sort: params.currentIndex },
    })

    return true
  }
}
