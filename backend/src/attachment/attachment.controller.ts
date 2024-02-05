import * as fs from 'fs'
import * as path from 'path'
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
  UseGuards,
  Body,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import * as multer from 'multer'
import { v4 } from 'uuid'
import { PrismaService } from '../global/prisma.service'
import { LoginGuard } from '../utils/login.guard'

const STATIC_PATH = '/static'

const storage = multer.diskStorage({
  destination(req, _file, cb) {
    // 有name参数为分片上传
    const { name = '' } = req.body
    const folder = path.join(process.cwd(), STATIC_PATH, name)
    // 判断是否已创建文件夹
    if (name && !fs.existsSync(folder)) {
      fs.mkdirSync(folder)
    }
    cb(null, folder)
  },
  filename(req, file, cb) {
    // 分片时使用下标作为文件名，否则随机文件名
    const { index } = req.body
    cb(null, index ?? `${v4()}${path.extname(file.originalname)}`)
  },
})

@Controller('attachment')
export class AttachmentController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('check')
  @UseGuards(LoginGuard)
  check(@Query('hash') hash: string) {
    return this.prisma.attachment
      .findUnique({ where: { hash }, select: { url: true } })
      .then(file => file?.url)
  }

  @Post()
  @UseGuards(LoginGuard)
  @UseInterceptors(FileInterceptor('file', { storage }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { name?: string; index?: number; hash?: string },
  ) {
    const url = `${STATIC_PATH}/${file.filename}`
    if (!body.name && body.hash) {
      await this.prisma.attachment.create({
        data: { hash: body.hash, name: file.originalname, url },
      })
    }
    return url
  }

  @Get('merge')
  @UseGuards(LoginGuard)
  async merge(
    @Query('key') key: string,
    @Query('name') name: string,
    @Query('extName') extName: string,
    @Query('hash') hash: string,
  ) {
    // 读取分片并组合文件
    const dir = path.join(process.cwd(), STATIC_PATH, key)
    const chunks = fs.readdirSync(dir)
    let pos = 0,
      count = 0

    const fileName = `${v4()}.${extName}`
    const filePath = path.join(process.cwd(), STATIC_PATH, fileName)

    chunks.map((_, index) => {
      const chunkPath = path.join(dir, index + '')
      const stream = fs.createReadStream(chunkPath)
      stream
        .pipe(fs.createWriteStream(filePath, { start: pos }))
        .on('finish', () => {
          count++
          if (count === chunks.length) {
            fs.rm(dir, { recursive: true }, () => {})
          }
        })

      pos += fs.statSync(chunkPath).size
    })

    const url = `${STATIC_PATH}/${fileName}`

    await this.prisma.attachment.create({ data: { url, hash, name } })

    return url
  }
}
