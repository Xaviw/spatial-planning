import { Module, ValidationPipe } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { AttachmentModule } from './attachment/attachment.module'
import { ConfigModule } from './config/config.module'
import { GlobalModule } from './global/global.module'
import { MapModule } from './map/map.module'
import { MenuModule } from './menu/menu.module'
import { SiderModule } from './sider/sider.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    GlobalModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    UserModule,
    AttachmentModule,
    MenuModule,
    ConfigModule,
    SiderModule,
    MapModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {}
