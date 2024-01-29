import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request, Response } from 'express'
import { Observable } from 'rxjs'
import { PrismaService } from '../global/prisma.service'

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private readonly jwtService: JwtService

  @Inject(PrismaService)
  private readonly prismaService: PrismaService

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const http = context.switchToHttp()
    const request: Request = http.getRequest()
    const response: Response = http.getResponse()

    const accessToken = request.header('Access-Token')
    const refreshToken = request.header('Refresh-Token')

    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException('请先登录！')
    }

    // 校验Access-Token
    return this.jwtService
      .verifyAsync(accessToken)
      .then(async ({ id }) => {
        console.log('id: ', id)
        // 获取用户信息
        const user = await this.prismaService.user.findFirst({
          where: { id },
        })

        if (!user) {
          throw new UnauthorizedException('登录已失效，请重新登录！')
        }

        return true
      })
      .catch(() => {
        // Access-Token无效时校验Refresh-Token
        return this.jwtService
          .verifyAsync(refreshToken)
          .then(async ({ id }) => {
            // 获取用户信息
            const user = await this.prismaService.user.findFirst({
              where: { id },
            })

            if (!user) {
              throw new UnauthorizedException('登录已失效，请重新登录！')
            }

            // 刷新token
            const accessToken = this.jwtService.sign(
              { id, name: user.name },
              { expiresIn: '1h' },
            )

            const refreshToken = this.jwtService.sign(
              { id },
              { expiresIn: '7d' },
            )

            response.setHeader('access-token', accessToken)
            response.setHeader('refresh-token', refreshToken)

            return true
          })
          .catch(() => {
            throw new UnauthorizedException('登录已失效，请重新登录！')
          })
      })
  }
}
