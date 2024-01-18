import { Module, ValidationPipe } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { AttachmentModule } from './attachment/attachment.module'
import { MenuModule } from './menu/menu.module'
import { PrismaModule } from './prisma/prisma.module'
import { ResponseFilter } from './utils/response.filter'
import { ResponseInterceptor } from './utils/response.interceptor'

@Module({
  imports: [AttachmentModule, MenuModule, PrismaModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ResponseFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {}
