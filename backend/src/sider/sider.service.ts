import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../global/prisma.service'
import { UpdateSiderDto } from './dto'
import { MaterialItem, SiderItem, SiderPosition } from '#/business'

@Injectable()
export class SiderService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService

  getList(menuId: string, position: SiderPosition, filter: boolean) {
    return this.prisma.sider.findMany({
      where: {
        isDelete: false,
        status: filter || undefined,
        menuId,
        position,
      },
      orderBy: { sort: 'asc' },
      select: {
        id: true,
        menuId: true,
        position: !filter,
        status: !filter,
        createTime: !filter,
        updateTime: !filter,
        sort: !filter,
        // 同时获取物料数据
        material: {
          select: {
            id: true,
            type: true,
            props: true,
            sort: !filter,
            status: !filter,
            siderId: !filter,
          },
        },
      },
    })
  }

  async update(operations: UpdateSiderDto['siders']) {
    const handlers: Promise<any>[] = []

    for (const operation of operations) {
      const { menuId, position, sort, status } = operation.value as SiderItem
      const {
        props,
        type,
        status: materialStatus,
      } = operation.value.material as MaterialItem

      let handler: Promise<any>

      if (operation.op === 'add') {
        handler = this.prisma.sider.create({
          data: {
            menuId,
            position,
            sort,
            status,
            material: { create: { props, type, sort: 0 } },
          },
        })
      } else if (operation.op === 'remove') {
        handler = this.prisma.sider.update({
          where: { id: operation.id },
          data: { isDelete: true },
        })
      } else {
        handler = this.prisma.sider.update({
          where: { id: operation.id },
          data: {
            position,
            sort,
            status,
            material: { update: { props, type, status: materialStatus } },
          },
        })
      }

      handlers.push(handler)
    }

    return Promise.all(handlers)
  }
}
