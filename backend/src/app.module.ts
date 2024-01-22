import { Module, ValidationPipe } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { AttachmentModule } from './attachment/attachment.module'
import { GlobalModule } from './global/global.module'
import { MenuModule } from './menu/menu.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    GlobalModule,
    AttachmentModule,
    MenuModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {}
