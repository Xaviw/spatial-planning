import { Inject, Injectable } from '@nestjs/common'
import { pick } from '@sp/shared/utils'
import { PrismaService } from '../global/prisma.service'
import { UpdateMapDto } from './dto'

@Injectable()
export class MapService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService

  getList(menuId: string, filter: boolean) {
    // 获取图层、覆盖物、物料
    return this.prisma.layer.findMany({
      where: {
        isDelete: false,
        status: filter || undefined,
        menuId,
      },
      orderBy: { sort: 'asc' },
      select: {
        id: true,
        name: true,
        asLegend: true,
        legendImg: true,
        menuId: true,
        status: !filter,
        createTime: !filter,
        updateTime: !filter,
        // 同时获取覆盖物数据
        overlays: {
          select: {
            id: true,
            layerId: true,
            type: true,
            name: true,
            props: true,
            detailTitle: true,
            detailWidth: true,
            status: !filter,
            createTime: !filter,
            updateTime: !filter,
            materials: {
              orderBy: { sort: 'asc' },
              select: { id: true, type: true, props: true },
              where: { isDelete: false },
            },
          },
          where: { isDelete: false },
        },
      },
    })
  }

  async setList(operations: UpdateMapDto) {
    const handlers: Promise<any>[] = []

    for (const operation of operations.layers) {
      let handler: Promise<any>

      const data = pick(operation.value, [
        'asLegend',
        'name',
        'legendImg',
        'sort',
        'status',
        'menuId',
      ])

      if (operation.op === 'add') {
        handler = this.prisma.layer.create({
          data,
        })
      } else if (operation.op === 'remove') {
        handler = this.prisma.layer.delete({ where: { id: operation.id } })
      } else {
        handler = this.prisma.layer.update({
          where: { id: operation.id },
          data,
        })
      }

      handlers.push(handler)
    }

    for (const operation of operations.overlays) {
      let handler: Promise<any>

      const data = pick(operation.value, [
        'layerId',
        'type',
        'name',
        'props',
        'detailTitle',
        'detailWidth',
        'status',
      ])

      if (operation.op === 'add') {
        handler = this.prisma.overlay.create({
          data,
        })
      } else if (operation.op === 'remove') {
        handler = this.prisma.overlay.delete({ where: { id: operation.id } })
      } else {
        handler = this.prisma.overlay.update({
          where: { id: operation.id },
          data,
        })
      }

      handlers.push(handler)
    }

    for (const operation of operations.materials) {
      let handler: Promise<any>

      const data = pick(operation.value, ['type', 'props', 'isTitle', 'sort'])

      if (operation.op === 'add') {
        handler = this.prisma.material.create({
          data,
        })
      } else if (operation.op === 'remove') {
        handler = this.prisma.material.delete({ where: { id: operation.id } })
      } else {
        handler = this.prisma.material.update({
          where: { id: operation.id },
          data,
        })
      }

      handlers.push(handler)
    }

    return Promise.all(handlers)
  }
}
