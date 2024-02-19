import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { is } from 'ramda'
import { PrismaService } from '../global/prisma.service'
import { formatDateField } from '../utils'
import { CreateMenuDto, MoveMenuDto, UpdateMenuDto } from './dto'

@Injectable()
export class MenuService {
  @Inject(PrismaService)
  private prisma!: PrismaService

  async getMenu(filter: boolean) {
    const menus = await this.prisma.menu.findMany({
      where: {
        status: filter || undefined,
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
    })

    const transformedMenus = (filter
      ? menus
      : formatDateField(menus)) as unknown as any[]

    const maps = new Map(transformedMenus.map(item => [item.id, item]))

    const result: any[] = []

    for (const menu of transformedMenus) {
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
      is(Number, maxSort._max.sort) && maxSort._max.sort
        ? maxSort._max.sort + 1
        : 0

    const newMenu = await this.prisma.menu.create({
      data: { ...menu, sort },
    })

    return newMenu.id
  }

  async updateMenu(id: string, menu: UpdateMenuDto) {
    await this.prisma.menu.update({ where: { id: id }, data: menu })

    return true
  }

  async removeMenu(id: string) {
    // 逻辑删除
    await this.prisma.menu.delete({ where: { id } })

    return true
  }

  async moveMenu(id: string, params: MoveMenuDto) {
    const menu = await this.prisma.menu.findFirst({
      where: { id: id },
      select: { parentId: true, sort: true },
    })
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
      where: { id: id },
      data: { parentId: params.currentParentId, sort: params.currentIndex },
    })

    return true
  }
}
