import { Inject, Injectable } from '@nestjs/common'
import { pick } from 'ramda'
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
            modalTitle: true,
            modalWidth: true,
            status: !filter,
            createTime: !filter,
            updateTime: !filter,
            materials: {
              orderBy: { sort: 'asc' },
              select: {
                id: true,
                type: true,
                props: true,
                status: !filter,
                createTime: !filter,
                updateTime: !filter,
              },
              where: { status: filter || undefined },
            },
          },
          where: { status: filter || undefined },
        },
      },
    })
  }

  async setList(operations: UpdateMapDto) {
    // 存储sql事件
    const handlers: Promise<any>[] = []
    // 存储前端id和创建后id的映射
    const idMap: Recordable = {}

    // 图层处理
    // 新增的图层需要将id关联到覆盖物数据
    const syncLayerList: Promise<[string, string]>[] = []
    for (const operation of operations.layers) {
      let handler: Promise<any> | undefined

      const data: any = pick(
        ['asLegend', 'name', 'legendImg', 'sort', 'status', 'menuId'],
        operation.value,
      )

      if (operation.op === 'add') {
        syncLayerList.push(
          this.prisma.layer
            .create({
              data,
            })
            .then(layer => [operation.value.id, layer.id]),
        )
      } else if (operation.op === 'remove') {
        handler = this.prisma.layer.delete({ where: { id: operation.id } })
      } else {
        handler = this.prisma.layer.update({
          where: { id: operation.id },
          data,
        })
      }

      handler && handlers.push(handler)
    }
    // 映射前端传来的id和实际id
    await Promise.all(syncLayerList).then(layers => {
      for (const [feId, id] of layers) {
        idMap[feId] = id
      }
    })

    // 覆盖物处理
    // 新增的覆盖物需要将id关联到物料数据
    const syncOverlayList: Promise<[string, string]>[] = []
    for (const operation of operations.overlays) {
      let handler: Promise<any> | undefined

      const data: any = pick(
        [
          'layerId',
          'type',
          'name',
          'props',
          'modalTitle',
          'modalWidth',
          'status',
        ],
        operation.value,
      )

      if (operation.op === 'add') {
        syncOverlayList.push(
          this.prisma.overlay
            .create({
              data: {
                ...data,
                // 改为实际的id
                layerId: data.layerId.startsWith('add')
                  ? idMap[data.layerId]
                  : data.layerId,
              },
            })
            .then(overlay => [operation.value.id, overlay.id]),
        )
      } else if (operation.op === 'remove') {
        handler = this.prisma.overlay.delete({ where: { id: operation.id } })
      } else {
        handler = this.prisma.overlay.update({
          where: { id: operation.id },
          data,
        })
      }

      handler && handlers.push(handler)
    }
    // 映射前端传来的id和实际id
    await Promise.all(syncOverlayList).then(layers => {
      for (const [feId, id] of layers) {
        idMap[feId] = id
      }
    })

    // 处理物料
    for (const operation of operations.materials) {
      let handler: Promise<any>

      const data: any = pick(
        ['type', 'props', 'isTitle', 'sort'],
        operation.value,
      )

      if (operation.op === 'add') {
        handler = this.prisma.material.create({
          data: {
            ...data,
            overlayId: operation.value.overlayId.startsWith('add')
              ? idMap[operation.value.overlayId]
              : operation.value.overlayId,
          },
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
