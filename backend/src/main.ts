import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors({
    origin: /^(http:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?$/,
    credentials: true,
    methods: '*',
    exposedHeaders: '*',
    allowedHeaders: '*',
  })
  app.useStaticAssets('static', { prefix: '/static' })
  await app.listen(3000)
}
bootstrap()
