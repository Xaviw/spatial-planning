import { Global, Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { PrismaService } from './prisma.service'
import { ResponseFilter } from './response.filter'
import { ResponseInterceptor } from './response.interceptor'

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ResponseFilter,
    },
  ],
  exports: [PrismaService],
})
export class GlobalModule {}
