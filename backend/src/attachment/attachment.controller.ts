import * as fs from 'fs'
import * as path from 'path'
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import * as multer from 'multer'
import { v4 } from 'uuid'

const STATIC_PATH = 'static'
const URL_BASE = `http://127.0.0.1:3000/${STATIC_PATH}`

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
  check(@Query('hash') _hash: string) {
    return { code: 1, data: null }
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage }))
  upload(@UploadedFile() file: Express.Multer.File) {
    return `${URL_BASE}/${file.filename}`
  }

  @Get('merge')
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
