import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../global/prisma.service'

@Injectable()
export class SidebarService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService

  update(_param: any) {
    this.prisma
  }
}
