import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../global/prisma.service'
import { UpdateSiderDto } from './dto'
import { MaterialItem, SiderItem, SiderPosition } from '#/business'
import { TitleProps } from '#/materials'

@Injectable()
export class SiderService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService

  async getList(menuId: string, position: SiderPosition, filter: boolean) {
    // 获取属于菜单的侧边栏数据
    const list = await this.prisma.sider.findMany({
      where: {
        isDelete: false,
        status: filter || undefined,
        menuId,
        position,
      },
      orderBy: { sort: 'asc' },
      select: {
        id: true,
        position: !filter,
        status: !filter,
        createTime: !filter,
        updateTime: !filter,
        // 同时获取物料数据
        materials: {
          orderBy: { sort: 'asc' },
          select: { isTitle: true, props: true, type: true, id: true },
          where: { isDelete: false },
        },
      },
    })

    const results: SiderItem[] = []

    // 遍历侧边栏数据构建返回数据
    for (const item of list) {
      const sider = { ...item, materials: undefined } as unknown as SiderItem

      // 查找对应侧边栏的物料数据（有可能有Title组件内部的物料数据）
      const materialIndex = item.materials.findIndex(m => !m.isTitle)
      const material = item.materials[materialIndex] as MaterialItem

      sider.material = material

      // 存在Title内部的物料数据时，添加到modalData
      if (item.materials.length > 1 && material.type === 'Title') {
        item.materials.splice(materialIndex, 1)
        ;(sider.material.props as TitleProps).modalData = item.materials
      }

      results.push(sider)
    }

    return results
  }

  async update(operations: UpdateSiderDto) {
    const handlers: Promise<any>[] = []

    for (const operation of operations.siders) {
      let handler: Promise<any>

      const { position, status, sort, menuId } = operation.value as Recordable

      if (operation.op === 'add') {
        handler = this.prisma.sider.create({
          data: { position, status, sort, menuId },
        })
      } else if (operation.op === 'remove') {
        handler = this.prisma.sider.delete({ where: { id: operation.id } })
      } else {
        handler = this.prisma.sider.update({
          where: { id: operation.id },
          data: { position, status, sort, menuId },
        })
      }

      handlers.push(handler)
    }

    for (const operation of operations.materials) {
      let handler: Promise<any>

      const { type, props, isTitle, sort } = operation.value as Recordable

      if (operation.op === 'add') {
        handler = this.prisma.material.create({
          data: { type, props, isTitle, sort },
        })
      } else if (operation.op === 'remove') {
        handler = this.prisma.material.delete({ where: { id: operation.id } })
      } else {
        handler = this.prisma.material.update({
          where: { id: operation.id },
          data: { type, props, isTitle, sort },
        })
      }

      handlers.push(handler)
    }

    return Promise.all(handlers)
  }
}
