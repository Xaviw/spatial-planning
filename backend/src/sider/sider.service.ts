import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../global/prisma.service'
import { formatDateField } from '../utils'
import { UpdateSiderDto } from './dto'
import type { SiderItem, SiderPosition } from '#/business'

@Injectable()
export class SiderService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService

  async getList(menuId: string, position: SiderPosition, filter: boolean) {
    const list = await this.prisma.sider.findMany({
      where: {
        // 后台（filter=false）不筛选status
        status: filter || undefined,
        menuId,
        position,
      },
      orderBy: { sort: 'asc' },
      select: {
        id: true,
        // 后台（filter=false）才返回
        status: !filter,
        createTime: !filter,
        updateTime: !filter,
        // 同时获取物料数据
        material: {
          select: {
            id: true,
            type: true,
            props: true,
          },
        },
      },
    })

    // 铺平数据
    return formatDateField(list).map(
      (item: any) =>
        ({
          ...item,
          material: undefined,
          materialId: item.material?.id,
          type: item.material?.type,
          props: item.material?.props,
        }) as unknown as SiderItem,
    )
  }

  async update(operations: UpdateSiderDto['siders']) {
    const handlers: Promise<any>[] = []

    for (const operation of operations) {
      const { menuId, position, sort, status, type, props } =
        operation.value || {}

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
        handler = this.prisma.sider.delete({
          where: { id: operation.id },
        })
      } else {
        handler = this.prisma.sider.update({
          where: { id: operation.id },
          data: {
            position,
            sort,
            status,
            material: { update: { props, status } },
          },
        })
      }

      handlers.push(handler)
    }

    return Promise.all(handlers)
  }
}
