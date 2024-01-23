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
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import * as multer from 'multer'
import { v4 } from 'uuid'
import { LoginGuard } from '../utils/login.guard'

const STATIC_PATH = process.env.VITE_STATIC_PATH!
const URL_BASE = process.env.VITE_HOST + STATIC_PATH

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
  constructor() {}

  @Get('check')
  @UseGuards(LoginGuard)
  check(@Query('hash') _hash: string) {
    return { code: 1, data: null }
  }

  @Post()
  @UseGuards(LoginGuard)
  @UseInterceptors(FileInterceptor('file', { storage }))
  upload(@UploadedFile() file: Express.Multer.File) {
    return `${URL_BASE}/${file.filename}`
  }

  @Get('merge')
  @UseGuards(LoginGuard)
  merge(@Query('name') name: string, @Query('extName') extName: string) {
    // 读取分片并组合文件
    const dir = path.join(process.cwd(), STATIC_PATH, name)
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

    return `${URL_BASE}/${fileName}`
  }
}
