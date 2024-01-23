import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { PrismaService } from '../global/prisma.service'
import { LoginGuard } from '../utils/login.guard'

@Controller('config')
export class ConfigController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @UseGuards(LoginGuard)
  async getConfigs() {
    const records = await this.prisma.config.findMany()

    const configs: Recordable = {}

    for (const record of records) {
      configs[record.key] = record.value
    }

    return configs
  }

  @Put()
  @UseGuards(LoginGuard)
  async setConfigs(@Body() body: Recordable) {
    const handlers: Promise<any>[] = []

    for (const key in body) {
      const handler = this.prisma.config
        .findUnique({ where: { key } })
        .then(exists => {
          if (exists) {
            return this.prisma.config.update({
              where: { key },
              data: { value: body[key] },
            })
          } else {
            return this.prisma.config.create({
              data: { key, value: body[key] },
            })
          }
        })

      handlers.push(handler)
    }

    await Promise.all(handlers)
  }
}
