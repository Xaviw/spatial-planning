import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import { Response } from 'express'

@Catch(HttpException)
export class ResponseFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp()
    const response = http.getResponse<Response>()

    const code = exception.getStatus()
    const res = exception.getResponse() as { message: string[] }

    response.status(code).json({
      code: 0,
      message: Array.isArray(res?.message)
        ? res.message.join('；')
        : exception.message,
    })
  }
}
